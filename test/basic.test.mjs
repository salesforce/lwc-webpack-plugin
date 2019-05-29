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

    const testComponent = async dir => {
        const { code } = await bundle({
            entry: `${dir}/x/component/component.js`
        }, {
            modules: [ { dir: `${dir}/x` } ]
        })

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
})
