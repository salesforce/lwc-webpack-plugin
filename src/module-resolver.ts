/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { basename, dirname, extname, resolve } from 'path'

const lwcResolver = require('@lwc/module-resolver')

const EMPTY_STYLE = resolve(__dirname, 'mocks', 'empty-style.js')

function isImplicitHTMLImport(importee: string, importer: string) {
    return (
        extname(importer) === '.js' &&
        extname(importee) === '.html' &&
        dirname(importer) === dirname(importee) &&
        basename(importer, '.js') === basename(importee, '.html')
    )
}

function isImplicitCssImport(importee: string, importer: string) {
    return (
        extname(importee) === '.css' &&
        extname(importer) === '.html' &&
        (basename(importee, '.css') === basename(importer, '.html') ||
            basename(importee, '.scoped.css') === basename(importer, '.html'))
    );
}

/**
 * Webpack plugin to resolve LWC modules.
 */
export class LwcModuleResolverPlugin {
    public fs: any
    modules: any[]

    constructor(modules: any[]) {
        this.modules = modules
    }

    apply(resolver: any) {
        this.fs = resolver.fileSystem
        resolver.hooks.module.tapAsync(
            'LWC module',
            (req: any, ctx: any, cb: any) => this.resolveModule(req, ctx, cb)
        )
        resolver.hooks.file.tapAsync('LWC CSS', (req: any, ctx: any, cb: any) =>
            this.resolveFile(req, ctx, cb)
        )
    }

    resolveModule(req: any, ctx: any, cb: any) {
        let {
            request,
            // eslint-disable-next-line prefer-const
            query,
            context: { issuer }
        } = req

        try {
            if (!issuer) {
                issuer = process.cwd()
            }

            request = request.replace('./', '')

            let mod

            if (this.modules && this.modules.length) {
                mod = lwcResolver.resolveModule(request, issuer, {
                    modules: this.modules
                })
            } else {
                mod = lwcResolver.resolveModule(request, issuer)
            }

            return cb(undefined, {
                path: mod.entry,
                query,
                file: true,
                resolved: true
            })
        } catch (e) {
            // LWC Module Resolver will throw errors for any non lwc modules
            cb()
        }
    }

    resolveFile(req: any, ctx: any, cb: any) {
        const { path: resourcePath, query } = req
        const extFilename = extname(resourcePath)

        if (extFilename !== '.css' && extFilename !== '.html') {
            return cb()
        }

        this.fs.stat(resourcePath, (err: { code: string } | null) => {
            if (err !== null && err.code === 'ENOENT') {
                const isCSS = extFilename === '.css';
                if (
                    isCSS && 
                    !isImplicitCssImport(resourcePath, req.context.issuer)
                ) {
                    // warning for a missing non-implicit CSS import
                    console.warn(`The imported CSS file ${resourcePath} does not exist: Importing it as undefined.`)
                }
                if (
                    isCSS ||
                    isImplicitHTMLImport(resourcePath, req.context.issuer)
                ) {
                    return cb(null, {
                        path: EMPTY_STYLE,
                        query,
                        file: true,
                        resolved: false
                    })
                }
            }

            return cb()
        })
    }
}
