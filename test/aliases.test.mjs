/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import {assertCodeIsValid, bundle, testSnapshot} from './utils.mjs'

describe('aliases', () => {
    it('can import @lwc/synthetic-shadow', async () => {
        const { code } = await bundle({
            entry: 'aliases/importSyntheticShadow.js'
        })
        await testSnapshot(code)
        assertCodeIsValid(code)
    })

    it('can import wire-service as @lwc/wire-service', async () => {
        const { code } = await bundle({
            entry: 'aliases/importWireService.js'
        })
        await testSnapshot(code)
        assertCodeIsValid(code)
    })
})
