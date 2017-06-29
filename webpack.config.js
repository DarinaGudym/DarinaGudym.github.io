var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

var NODE_ENV = process.env.NODE_ENV;
var ENTRY = process.env.ENTRY;

var plugins = [];

switch(NODE_ENV) {
    case 'production':
        plugins = [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.optimize.AggressiveMergingPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                },
                'WEATHERAPP_ID': JSON.stringify('7954948e51bc8b8083af5df169457ff4')
            }),
            new BundleTracker({filename: './build/webpack-stats.json'})
        ];
        break;
    default:
        plugins = [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.optimize.AggressiveMergingPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('development')
                },
                'WEATHERAPP_ID': JSON.stringify('7954948e51bc8b8083af5df169457ff4')
            }),
            new BundleTracker({filename: './build/webpack-stats.json'})
        ];
}

module.exports = {
    entry: ['babel-polyfill', ENTRY],
    output: {path: __dirname, filename: 'build/build.js', publicPath: '/'},
    plugins: plugins,
    module: {
        loaders: [{
            test: /.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015', 'react', 'stage-0'],
                plugins: [
                    'transform-runtime',
                    'transform-decorators-legacy',
                    'transform-class-properties'
                ]
            }
        }]
    }
};
