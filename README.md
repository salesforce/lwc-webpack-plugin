# lwc-webpack-plugin

This plugin allows you to use LWC within any web framework project that uses Webpack.

## Install

    npm install --save-dev lwc-webpack-plugin lwc @lwc/module-resolver

Note that you must install your own dependencies for `lwc` and `@lwc/module-resolver`.

## Usage

```javascript
const LwcWebpackPlugin = require('lwc-webpack-plugin')

module.exports = {
    plugins: [new LwcWebpackPlugin()]
}
```

The above example assumes that you have configured LWC modules via `lwc.config.json` in your project root, or as `lwc` key in your package.json. You can read more about module configuration [in this blog](https://developer.salesforce.com/blogs/2020/09/lightning-web-components-module-resolution.html), or in [this RFC](https://rfcs.lwc.dev/rfcs/lwc/0020-module-resolution).

Pass the module configuration as parameter to the plugin, if you prefer to not use any of the above mentioned LWC module configuration options.

```javascript
const LwcWebpackPlugin = require('lwc-webpack-plugin')

module.exports = {
    plugins: [
        new LwcWebpackPlugin({
            modules: [
                { npm: 'lwc-recipes-oss-ui-components' },
                { npm: 'lightning-base-components' }
            ]
        })
    ]
}
```

The plugin takes also two additional configuration options:

-   `stylesheetConfig`
-   `outputConfig`

These options are 1:1 mappings of the LWC Compiler options, which are documented [here](https://github.com/salesforce/lwc/tree/master/packages/%40lwc/compiler#compiler-configuration-example).

Read more about Lightning Web Components [here](https://github.com/muenzpraeger/create-lwc-app).

## Live App

If you want to see Lightning Web Components in action - check out [https://recipes.lwc.dev](https://recipes.lwc.dev).

## TypeScript

If you want to use TypeScript in your LWC components, you can install the necessary Babel dependencies:

```shell
npm install --save-dev \
    babel-loader@^8 \
    @babel/preset-typescript@^7 \
    @babel/plugin-syntax-decorators@^7
```

Then add this to your `webpack.config.js`:

```js
module.exports = {
  plugins: [
    new LwcWebpackPlugin(),
    // Add this _after_ LwcWebpackPlugin:
    {
      apply(compiler) {
        compiler.options.module.rules.push({
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-typescript'],
              plugins: [['@babel/plugin-syntax-decorators', { legacy: true }]],
            }
          }
        })
      }
    }
  ]
}
```

You may customize the `babel-loader` settings to suit your needs.

## Tests

To run the tests in this repo, do:

    yarn test

To update snapshot files:

    UPDATE_SNAPSHOTS=1 yarn test

To run code coverage tests:

    yarn test:coverage
