/*
 * @Date: 2019-08-16 09:19:29
 * @LastEditors: Jesse
 * @LastEditTime: 2019-09-12 14:21:51
 */
const path = require('path')
const merge = require('webpack-merge')
const catalog = require('./catalog')
const base = require('./webpack.base.config')
const chalk = require('chalk')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const notifier = require('node-notifier')

console.log(chalk.blue('当前是开发环境'))

module.exports = merge(base, {
    devtool: 'cheap-module-eval-source-map',
    output: {
        publicPath: catalog.baseOutputDir,
        filename: 'js/[name].js',
        chunkFilename: 'js/[name]-chunk.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, '../xingguang'),
        host: catalog.host,
        port: 80,
        quiet: true,
        overlay: true, // 浏览器中显示编译器错误
        proxy: {
            '/user/login': { // 用于获取登录态
                target: catalog.target,
                secure: false,
                changeOrigin: true
            },
            '/': {
                target: catalog.target,
                secure: false,
                changeOrigin: true,
                bypass: function (req, res, proxyOptions) {
                    if (req.url.indexOf('/dist') >= 0) {
                        return req.url
                    }
                    if (req.url.indexOf('/static_guojiang_tv') >= 0) {
                        return req.url
                    }
                }
            }

        }
    },
    plugins: [
        new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
                messages: ['You application is running here http://' + catalog.host + catalog.basePageOutputDir]
            },
            onErrors: function (severity, errors) {
                if (severity !== 'error') return
                const error = errors[0]
                console.log(error)
                notifier.notify({
                    title: 'Webpack error',
                    message: severity + ': ' + error.webpackError,
                    subtitle: error.file || ''
                })
            }
        }),
        new HtmlWebpackHarddiskPlugin(),
        new ExtractTextPlugin('css/[name].css')
    ]
})
