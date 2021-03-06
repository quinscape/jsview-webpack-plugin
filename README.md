# JsView Webpack Plugin

Javascript companion project for the spring-jsview view integration 
into Spring Boot / Spring WebMVC.

Extracts JSON data about webpack entry points from the current 
webpack build and cleans old assets.

## Usage

```js
const JsViewPlugin = require("jsview-webpack-plugin");
const path = require("path");

const PRODUCTION = (process.env.NODE_ENV === "production");

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        main: "./src/main/js/main.js"
    },
    
    devtool: "sourcemap",

    output: {
        path: path.join(__dirname, "target/ea-modern/js/"),
        filename: "bundle-[name]-[chunkhash].js",
        chunkFilename: "bundle-[id]-[chunkhash].js",
    },
    plugins: [
        new JsViewPlugin()
    ],

    module: {
        rules: [                                                                                                                                   
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: { test: /[\\/]node_modules[\\/]/, name: "vendors", chunks: "all" }
            }
        }
    }
};

```

The plugin will generate a "webpack-assets.json" file to the webpack build dir where the server-side lib will pick it up.

## Options

A map of options can be given as only argument to the JsView plugin. Valid options are.

 * generateAssetsJson (boolean) 

   if true (the default), generate the webpack-assets.json file

 * clean (array of string suffixes)

   Determines file endings of old asset files the plugin will clean from the build directory. 
   Default is `[".js", ".js.map", ".css", ".css.map"]`

 * debug (boolean)

   If true (default is false), print some informational logs while operating.

