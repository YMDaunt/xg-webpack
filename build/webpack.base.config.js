/*
 * @Date: 2019-08-16 09:19:29
 * @LastEditors: Jesse
 * @LastEditTime: 2019-09-05 10:44:49
 */
const path = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack')
const catalog = require('./catalog')
const utils = require('./utils')
const chalk = require('chalk')
const os = require('os')
const HappyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
})
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HashedChunkIdsPlugin = require('../plugins/hashedChunkIdsPlugin.js')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const HtmlWebpackIncludeJsPlugin = require('../plugins/htmlWebpackIncludeJsPlugin.js')
const HtmlWebpackScriptCrossoriginPlugin = require('html-webpack-script-crossorigin-plugin')
const resolveConfigDir = require('./resolve.config.js')
const file = require('../entry.json')

// 入口js文件配置以及公共模块配置
let entries = {}
let pages = {}

try {
    if (file && file.length > 0) {
        file.map((currentValue) => {
            entries = Object.assign(entries, utils.getEntry(catalog.entryDir + 'js/' + currentValue + '.js'))
        })
    } else {
        console.log(chalk.yellow('编译入口文件为空，执行全部文件编译'))
        entries = utils.getEntry(catalog.entryDir + 'js/**/*.js')
    }
} catch (err) {
    console.log(err)
    entries = utils.getEntry(catalog.entryDir + 'js/**/*.js')
}

entries.manifest = ['guide']

module.exports = {
    cache: true,
    resolve: resolveConfigDir,
    entry: entries,
    output: {
        path: catalog.outputDir
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        },
        {
            test: /\.ejs$/,
            use: 'happypack/loader?id=ejs'
        },
        {
            test: /\.js$/,
            enforce: 'pre',
            use: 'happypack/loader?id=eslint',
            exclude: [
                path.resolve(__dirname, '../xingguang/' + catalog.baseEntryDir + 'js/lib/'),
                path.resolve(__dirname, '../xingguang/' + catalog.baseEntryDir + 'js/common/'),
                path.resolve(__dirname, '../xingguang/' + catalog.baseEntryDir + 'js/component/')
            ]
        },
        {
            test: /\.js$/,
            use: 'happypack/loader?id=babel',
            exclude: [
                'node_modules',
                path.resolve(__dirname, '../xingguang/' + catalog.baseEntryDir + 'js/lib/')
            ]
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader']
        },
        {
            test: /\.less$/,
            use: ExtractTextPlugin.extract([
                'css-loader',
                'postcss-loader',
                'less-loader'
            ])
        },
        {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
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
        }
        ]
    },
    plugins: [
        new HappyPack({
            id: 'ejs',
            threadPool: HappyThreadPool,
            loaders: ['ejs-loader']
        }),
        new HappyPack({
            id: 'eslint',
            threadPool: HappyThreadPool,
            loaders: [{
                loader: 'eslint-loader',
                options: {
                    fix: true
                }
            }]
        }),
        new HappyPack({
            id: 'babel',
            threadPool: HappyThreadPool,
            loaders: ['babel-loader?cacheDirectory=true']
        }),

        new HashedChunkIdsPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.DllReferencePlugin({
            // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
            context: __dirname,
            // 指定manifest.json
            manifest: require('../manifest/' + catalog.dllManifestName + '.json'),
            // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
            name: 'dll_library'
        }),
        new webpack.DllReferencePlugin({
            // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
            context: __dirname,
            // 指定manifest.json
            manifest: require('../manifest/' + catalog.vendorManifestName + '.json'),
            // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
            name: 'vendor_library'
        }),

        // 针对js文件添加crossOrigin属性 方便拿到js error
        new HtmlWebpackScriptCrossoriginPlugin({
            srcOrigin: 'static.guojiang.tv' // 可以是数组，也可以是string
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: [
                utils.getLatestFile(catalog.outputDir + 'js/lib/dll.**.js'),
                utils.getLatestFile(catalog.outputDir + 'css/lib/dll.**.css'),
                utils.getLatestFile(catalog.outputDir + 'js/vendor/vendor.**.js'),
                utils.getLatestFile(catalog.outputDir + 'css/vendor/vendor.**.css')
            ],
            append: false
        }),
        new HtmlWebpackIncludeJsPlugin({
            js: [{
                path: catalog.inlineSource,
                inject: 'inline' // 插入方式，内联
            }]
        })
    ]
}

/** *** 生成组合后的html *****/
if (file && file.length > 0) {
    file.map((currentValue) => {
        pages = Object.assign(pages, utils.getEntry(catalog.pageEntry + currentValue + '.ejs', catalog.basePageEntryDir))
    })
} else {
    pages = utils.getEntry(catalog.pageEntry + '**/*.ejs', catalog.basePageEntryDir)
}
console.log(pages)
for (const pathname in pages) {
    const conf = {
        template: catalog.pageEntry + pathname + '.js',
        filename: catalog.pageOutput + pathname + '.html',
        inject: true,
        cache: true, // 只改动变动的文件
        alwaysWriteToDisk: true,
        minify: {
            removeComments: true,
            collapseWhitespace: false
        }
    }
    // 根据chunks提取页面js,css和公共verdors
    if (pathname in module.exports.entry) {
        conf.chunks = [pathname, 'manifest']
    } else {
        conf.chunks = ['manifest']
    }
    module.exports.plugins.push(new HtmlWebpackPlugin(conf))
}
