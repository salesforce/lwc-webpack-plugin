/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { assertCodeIsValid, bundle } from './utils.mjs'
import * as mochaSnap from "mocha-snap"
const snap = mochaSnap.default.default

describe('aliases', () => {
    it('can import @lwc/synthetic-shadow', async () => {
        const { code } = await bundle({
            entry: 'aliases/importSyntheticShadow.js'
        })
        await snap(code)
        assertCodeIsValid(code)
    })

    it('can import wire-service as @lwc/wire-service', async () => {
        const { code } = await bundle({
            entry: 'aliases/importWireService.js'
        })
        await snap(code)
        assertCodeIsValid(code)
    })
})
