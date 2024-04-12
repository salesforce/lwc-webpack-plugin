/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import path from 'path'
import webpack from 'webpack'
import { merge } from 'webpack-merge'
import { createFsFromVolume, Volume } from 'memfs'
import LwcWebpackPlugin from '../dist/index.js'
import { promisify } from 'util'
import { expect } from 'chai'
import * as mochaSnap from "mocha-snap";

const snap = mochaSnap.default.default

const mfs = createFsFromVolume(new Volume())

const __dirname = path.dirname(new URL(import.meta.url).pathname)

const baseConfig = {
    mode: 'development',
    devtool: false,
    output: {
        path: '/',
        publicPath: '',
        filename: 'test.build.js'
    },
    externals: {
        lwc: 'lwc'
    }
}
// Largely borrowed from https://github.com/vuejs/vue-loader/blob/c1f4660/test/utils.js
async function bundle (options, lwcWebpackPluginOptions, mergeLastOptions = {}) {
    // make relative paths absolute
    options.entry = path.resolve(__dirname, 'fixtures', options.entry)
    if (lwcWebpackPluginOptions?.modules) {
        for (const mod of lwcWebpackPluginOptions.modules) {
            if (mod.dir) {
                mod.dir = path.resolve(__dirname, 'fixtures', mod.dir)
            }
        }
    }

    let config = merge({}, baseConfig, options, {
        plugins: [
            new LwcWebpackPlugin(lwcWebpackPluginOptions)
        ]
    }, mergeLastOptions)
    const webpackCompiler = webpack(config)
    webpackCompiler.outputFileSystem = mfs
    webpackCompiler.outputFileSystem.join = path.join.bind(path)

    const stats = await promisify(webpackCompiler.run.bind(webpackCompiler))()
    const code = mfs.readFileSync('/test.build.js').toString()
    return { code, stats }
}

function assertCodeIsValid(code) {
    expect(code).not.to.match(/Module (parse|build) failed/)
    expect(code).not.to.contain('Cannot find module')
}

async function testSnapshot(code) {
    // Replace LWC versions in the source code comments so that the snapshots don't change so frequently
    code = code
      .replace(/\/\*\* version: \d+\.\d+\.\d+ \*\//g, '/** version: X.X.X */')
      .replace(/\/\*LWC compiler v\d+\.\d+\.\d+\*\//g, '/*LWC compiler vX.X.X*/');
    await snap(code)
}

export {
    bundle,
    assertCodeIsValid,
    testSnapshot
}
