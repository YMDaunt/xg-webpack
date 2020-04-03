/*
 * @Date: 2019-08-20 10:32:31
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-30 09:28:27
 */
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const chalk = require('chalk')
const catalog = require('./catalog')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

console.log(chalk.blue('当前是生产环境'))

module.exports = merge(base, {
    output: {
        publicPath: catalog.outputPublicDir,
        filename: 'js/[name].[chunkhash:8].js',
        chunkFilename: 'js/[name]-chunk.[chunkhash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 70
                            },
                            optipng: {
                                enabled: false
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('css/[name].[contenthash:8].css'),
        new CleanWebpackPlugin(catalog.cleanDir, catalog.cleanOptions),
        // 压缩css代码
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css\.*(?!.*map)/g, // 注意不要写成 /\.css$/g
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: { removeAll: true },
                // 避免 cssnano 重新计算 z-index
                safe: true,
                autoprefixer: false
            },
            canPrint: true
        }),
        // 压缩JS代码
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            uglifyOptions: {
                ie8: false,
                output: {
                    comments: false,
                    beautify: false
                },
                compress: true,
                warnings: false
            }
        })

    ]
})
