/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const { URLSearchParams } = require("url");
const compiler = require('@lwc/compiler')
const { getInfoFromPath } = require('./module')
import { getOptions } from 'loader-utils'

module.exports = function (source: any) {
    const { resourcePath, resourceQuery } = this
    const { stylesheetConfig, outputConfig, experimentalDynamicComponent } =
        getOptions(this)

    let info
    try {
        info = getInfoFromPath(resourcePath, process.cwd())
    } catch (e) {
        info = {
            name: '',
            namespace: ''
        }
    }

    let codeTransformed = source

    // Scoped styles have paths like this: "foo.scoped.css?scoped=true"
    const scopedStyles = resourcePath.endsWith('.css') &&
        resourceQuery &&
        new URLSearchParams(resourceQuery).get('scoped') === 'true'

    const { code } = compiler.transformSync(codeTransformed, resourcePath, {
            name: info.name,
            namespace: info.ns,
            stylesheetConfig,
            outputConfig,
            experimentalDynamicComponent,
            scopedStyles
        })

    return code
}
