const config = require('./webpack.config');
const webpack = require('webpack');

const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: config.entry,
    module: {
        rules: config.module.rules.filter(
            rule => rule.enforce !== 'pre'
        ),
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        /*new webpack.optimize.UglifyJsPlugin({
            compressor: {
                passes: 5,
                warnings: false,
            },
            sourceMap: true,
        }),*/
        new webpack.EnvironmentPlugin([
            'NODE_ENV',
        ]),
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin('style.css'),
        new CompressionPlugin(),
    ],
    output: {
        filename: config.output.filename,
        path: config.output.path,
    },
    resolve: config.resolve,
};
