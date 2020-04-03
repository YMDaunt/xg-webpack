/*
 * @Date: 2019-08-16 09:19:29
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-19 15:51:25
 */
const webpack = require('webpack')
const chalk = require('chalk')
const catalog = require('./catalog.js')
const ExtractTextPlugin = require('extract-text-webpack-plugin') // 抽离css
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HashedChunkIdsPlugin = require('../plugins/hashedChunkIdsPlugin.js')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const resolveConfigDir = require('./resolve.config.js')
let entries // 入口
if (catalog.isPc) {
    entries = ['vue', 'axios', 'layer', 'jquery']
} else {
    entries = ['vue', 'axios', 'layer', 'webpack-zepto', 'weixin-js-sdk']
}

module.exports = {
    resolve: resolveConfigDir,
    entry: {
        dll: entries
    },
    output: {
        path: catalog.outputDir,
        publicPath: catalog.outputPublicDir,
        filename: 'js/lib/[name].[chunkhash:8].js',
        library: '[name]_library'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader?cacheDirectory=true',
            exclude: ['node_modules', catalog.baseEntryDir + 'js/lib', catalog.baseEntryDir + 'js/component']
        },
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract([
                'css-loader',
                'postcss-loader'
            ])
        },
        {
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader',
            options: {
                limit: 5120,
                name: function (p) {
                    let temPath
                    if (p.indexOf('/') !== -1) {
                        // linux
                        temPath = p.split(/\/img\//)[1]
                    } else {
                        // win
                        temPath = p.split(/\\img\\/)[1]
                    }
                    temPath = temPath.replace(/\\/g, '/')

                    return 'img/' + temPath + '?v=[hash:8]'
                }
            }
        }
        ]
    },
    plugins: [
        // 清除lib内旧版本的库文件，防止后面插入html时错乱
        // 服务器时间的更改会导致文件创建时间不准确
        new CleanWebpackPlugin([
            'css/lib/dll.*.css',
            'js/lib/dll.*.js'
        ], {
            root: catalog.outputDir
        }),
        // keep module.id stable when vender modules does not change
        new HashedChunkIdsPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.DllPlugin({
            // 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
            path: './manifest/' + catalog.dllManifestName + '.json',
            // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与参数output.library保持一致
            name: '[name]_library',
            // 指定一个路径作为上下文环境，需要与DllReferencePlugin的context参数保持一致，建议统一设置为项目根目录
            context: __dirname
        }),
        new ExtractTextPlugin('css/lib/[name].[contenthash:8].css')
    ]
}

/** *** 区分开发环境和生产环境 *****/

if (catalog.prod) {
    console.log(chalk.blue('当前是生产环境'))
    module.exports.plugins = module.exports.plugins.concat([
        // 压缩css代码
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css\.*(?!.*map)/g, // 注意不要写成 /\.css$/g
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                },
                // 避免 cssnano 重新计算 z-index
                safe: true,
                // cssnano通过移除注释、空白、重复规则、过时的浏览器前缀以及做出其他的优化来工作，一般能减少至少 50% 的大小
                // cssnano 集成了autoprefixer的功能。会使用到autoprefixer进行无关前缀的清理。默认不兼容ios8，会去掉部分webkit前缀，比如flex
                // 所以这里选择关闭，使用postcss的autoprefixer功能
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
    ])
} else {
    console.log(chalk.blue('当前是开发环境'))
    module.exports.devtool = 'cheap-module-eval-source-map'
}
