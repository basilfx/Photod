const config = require('./webpack.config');
const webpack = require('webpack');

const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');

module.exports = {
    devtool: false,
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
        new webpack.EnvironmentPlugin({
            'NODE_ENV': 'production',
            'DEMO': false,
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ExtractTextPlugin('style.css'),
        new BabiliPlugin(),
        new CompressionPlugin(),
    ],
    output: config.output,
    resolve: config.resolve,
};
