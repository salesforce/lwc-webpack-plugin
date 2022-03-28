/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { assertCodeIsValid, bundle } from './utils.mjs'
import * as mochaSnap from "mocha-snap"
const snap = mochaSnap.default.default

describe('basic test', () => {

    const testComponent = async (dir, extension = 'js', mergeLastOptions = {}) => {
        const { code } = await bundle({
            entry: `${dir}/x/component/component.${extension}`
        }, {
            modules: [ { dir: `${dir}/x` } ]
        }, mergeLastOptions)

        await snap(code)
        assertCodeIsValid(code)
    }

    it('component with HTML, CSS, and JS', async () => {
        await testComponent('basic')
    })

    it('component with implicit HTML', async () => {
        await testComponent('implicit-html')
    })

    it('component with implicit CSS', async () => {
        await testComponent('implicit-css')
    })

    it('component with scoped CSS', async () => {
        await testComponent('scoped-css')
    })

    it('component with multiple templates', async () => {
        await testComponent('multi-template')
    })

    it('component with typescript', async () => {
        await testComponent('typescript', 'ts', {
            // this plugin has to come after LwcWebpackPlugin because plugins/rules execute in reverse order
            plugins: [
                {
                    apply(compiler) {
                        compiler.options.module.rules.push({
                            test: /\.ts$/,
                            exclude: /node_modules/,
                            use: {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@babel/preset-typescript'],
                                    plugins: [['@babel/plugin-syntax-decorators', {legacy: true}]],
                                }
                            }
                        })
                    }
                },
            ]
        })
    })
})
