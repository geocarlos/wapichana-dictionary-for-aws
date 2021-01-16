const path = require('path');

let devTool = {};

if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
    devTool = {
        devtool: 'inline-source-map'
    }
}

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index.js',
        libraryTarget: 'commonjs'
    },
    target: 'node',
    externals: {
        'aws-sdk': 'aws-sdk'
    },
    ...devTool,
    mode: process.env.NODE_ENV ? process.env.NODE_ENV : 'production'
}