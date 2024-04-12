/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import {assertCodeIsValid, bundle, testSnapshot} from './utils.mjs'
import path from 'path'
import fs from 'fs/promises'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

describe('modules configuration test', () => {
    describe('external npm package', () => {
        beforeEach(async () => {
            await fs.mkdir(path.join(process.cwd(), 'node_modules/some-external-library/modules/y/component'), {
                recursive: true
            })
            await fs.writeFile(
              path.join(process.cwd(), 'node_modules/some-external-library/package.json'),
              JSON.stringify({
                  'name': 'some-external-library',
                  'lwc': {
                      modules: [ { dir: 'modules' } ],
                      "expose": [ "y/component" ]
                  }
              }),
              'utf8'
            )
            await fs.writeFile(
              path.join(process.cwd(), 'node_modules/some-external-library/modules/y/component/component.js'),
              `import { LightningElement } from 'lwc'; export default class extends LightningElement {};`,
              'utf8'
            )
            await fs.writeFile(
              path.join(process.cwd(), 'node_modules/some-external-library/modules/y/component/component.html'),
              `<template><h1>I am external!</h1></template>`,
              'utf8'
            )
        })

        afterEach(async () => {
            await fs.rm(path.join(process.cwd(), 'node_modules/some-external-library'), {
                recursive: true
            })
        })
        it('works with an external lib using the "npm" key', async () => {
            const { code } = await bundle({
                entry: `has-external/modules/x/component/component.js`
            }, {
                modules: [
                    { dir: 'has-external/modules' },
                    { npm: 'some-external-library' }
                ]
            })

            await testSnapshot(code)
            assertCodeIsValid(code)
        })
    })

    // This is actually not how aliases are supposed to work, but
    // this test confirms the existing behavior of lwc-webpack-plugin,
    // which basically treats `{ alias: 'foo', path: 'bar' }` the same
    // as `{ dir: 'bar' }`
    // https://lwc.dev/guide/es_modules#configure-module-resolution
    it('works with modules defined with the "alias" key', async () => {
        const { code } = await bundle({
            entry: `basic/x/component/component.js`
        }, {
            modules: [
                {
                    alias: 'thisStringDoesNotDoAnything',
                    path: path.resolve(__dirname, './fixtures/basic/x')
                },
            ]
        })

        await testSnapshot(code)
        assertCodeIsValid(code)
    })
})
