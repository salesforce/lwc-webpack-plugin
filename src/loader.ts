/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const compiler = require('@lwc/compiler')
const { getInfoFromPath } = require('./module')
import { getOptions } from 'loader-utils'

module.exports = function (source: any) {
    const { resourcePath } = this
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

    const cb = this.async()

    compiler
        .transform(codeTransformed, resourcePath, {
            name: info.name,
            namespace: info.ns,
            stylesheetConfig,
            outputConfig,
            experimentalDynamicComponent,
            scopedStyles: resourcePath.endsWith('.scoped.css')
        })
        .then((res: any) => {
            cb(null, res.code)
        })
        .catch((err: any) => {
            cb(err)
        })

    return
}
