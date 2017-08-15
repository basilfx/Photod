const path = require('path');
const webpack = require('webpack');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Detect if started via webpack-dev-server or not.
const isDevServer = process.argv[1].indexOf('webpack-dev-server') >= 0;

module.exports = {
    devtool: 'eval',
    entry: [
        'regenerator-runtime/runtime',
        'react-hot-loader/patch',
        './src/main.js',
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                    },
                },
            },
            {
                test: /\.json$/,
                use: 'json-loader',
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                }),
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!less-loader',
                }),
            },
            {
                test: /\.(gif|png|woff|woff2|eot|ttf|svg)$/,
                use: 'url-loader?limit=4096',
            },
        ],
    },
    performance: {
        hints: false,
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true,
        }),
        new webpack.EnvironmentPlugin({
            'DEMO': false,
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.WatchIgnorePlugin([
            path.resolve(__dirname, 'node_modules'),
        ]),
        new ExtractTextPlugin({
            disable: true,
        }),
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: true,
        }),
    ],
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
        publicPath: process.env.PUBLIC_PATH || (isDevServer ? 'http://localhost:8000/' : '/static/'),
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules'),
        ],
    },
};
