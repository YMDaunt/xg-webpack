/*
 * @Date: 2019-08-20 10:40:16
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-30 09:32:13
 */
const merge = require('webpack-merge')
const catalog = require('./catalog')
const base = require('./webpack.base.config')
const chalk = require('chalk')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

console.log(chalk.blue('当前是测试环境'))

module.exports = merge(base, {
    devtool: 'cheap-module-source-map',
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
        new ExtractTextPlugin('css/[name].[chunkhash:8].css'),
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
        })
    ]
})
