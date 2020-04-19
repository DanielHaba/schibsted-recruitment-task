"use strict";
const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: "./static/src/index.ts",
    output: {
        path: path.join(__dirname, "./static"),
        filename: "bundle.js",
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    { loader: "ts-loader" },
                ],
            },
        ],
    },
    devtool: false,
    plugins: [
        new webpack.SourceMapDevToolPlugin({}),
    ],
};