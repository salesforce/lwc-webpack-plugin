/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { basename, dirname, relative, resolve, sep } from 'path'

function getInfoFromPath(file: string, root: string) {
    if (!file.startsWith(root)) {
        let jsFile = file
        if (!file.endsWith('.js')) {
            const split = file.split('.')
            jsFile = split.slice(0, -1).join('.') + '.js'
        }
        const parent = dirname(file).split('/').pop()
        const baseFilename = basename(file).split('.').slice(0, -1).join('.')
        if (parent !== baseFilename) {
            jsFile = resolve(dirname(file), `${parent}.js`)
        }

        throw new Error(`Invalid file  ${file} is not part of ${root}`)
    }

    const rel = relative(root, file)
    const parts = rel.split(sep)
    const end = parts.length - 1
    return {
        ns: parts[end - 2],
        name: parts[end - 1]
    }
}

module.exports = {
    getInfoFromPath
}
