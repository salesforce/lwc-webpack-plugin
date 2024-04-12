/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import {assertCodeIsValid, bundle, testSnapshot} from './utils.mjs'
import fs from 'fs/promises'
import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

describe('config test', () => {
    describe('lwc.config.json', () => {
        beforeEach(async () => {
            const config = {
                modules: [
                    { dir: path.join(__dirname, 'fixtures/basic/x') }
                ]
            }
            await fs.writeFile(
                path.join(process.cwd(), 'lwc.config.json'),
                JSON.stringify(config),
                'utf8'
            )
        })

        afterEach(async () => {
            await fs.rm(path.join(process.cwd(), 'lwc.config.json'))
        })

        it('basic component using lwc.config.json', async () => {
            const { code } = await bundle({
                entry: `basic/x/component/component.js`
            })

            await testSnapshot(code)
            assertCodeIsValid(code)
        })
    })

    describe('"lwc" key in package.json', () => {

        let oldPackageJson

        beforeEach(async () => {
            oldPackageJson = await fs.readFile(
                path.join(process.cwd(), 'package.json'),
                'utf8'
            )
            const config = {
                lwc: {
                    modules: [
                        { dir: path.join(__dirname, 'fixtures/basic/x') }
                    ]
                }
            }
            await fs.writeFile(
                path.join(process.cwd(), 'package.json'),
                JSON.stringify(config),
                'utf8'
            )
        })

        afterEach(async () => {
            await fs.writeFile(
                path.join(process.cwd(), 'package.json'),
                oldPackageJson,
                'utf8'
            )
        })

        it('basic component using lwc.config.json', async () => {
            const { code } = await bundle({
                entry: `basic/x/component/component.js`
            })

            await testSnapshot(code)
            assertCodeIsValid(code)
        })
    })

})
