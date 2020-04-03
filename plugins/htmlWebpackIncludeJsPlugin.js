const fs = require('fs')
const UglifyJS = require('uglify-js')

/**
 * @description 以内联或外联的方式插入资源到head内
 * js: [{
                // path: [], // publicpath后接的资源相对路径,如'js/lib/common.js'，直接外联
                path: [], // 文件访问的绝对路径, 如：path.resolve(__dirname, './static/common.js'), 此时需要配置inject: inline
                inject: 'inline', // 插入方式，不配置则外联资源，配置为inline则内联，此时path内需要是文件的绝对访问路径
                minify: true //是否压缩，默认是压缩
}]
 * @author smy
 * @date 2018-09-07
 * @class HtmlWebpackIncludeJsPlugin
 */
class HtmlWebpackIncludeJsPlugin {
    constructor (options) {
        this.options = Object.assign({
            js: []
        }, options)
    }

    apply (compiler) {
        compiler.plugin('compilation', (compilation) => {
            // 要插入的dom新节点
            let newDoms = ''
            compilation.plugin('html-webpack-plugin-before-html-processing', (data, callback) => {
                let fileArr = this.options.js

                // 每个html都是插入相同的信息
                // 所以判断newDoms是否为空可以保证处理头部js只处理一次
                if (newDoms === '') {
                    fileArr.forEach(data => {
                        let pathArr = data.path
                        if (data.inject === 'inline') {
                            // 内联代码方式
                            let inlineData = ''
                            pathArr.forEach(path => {
                                // 读取文件内容
                                let fileData = fs.readFileSync(path)
                                inlineData += `;${fileData.toString()}`
                            })

                            if (typeof (data.minify) === 'undefined' || data.minify) {
                                // 压缩混淆js
                                let uglifyData = UglifyJS.minify(inlineData)
                                inlineData = uglifyData.code
                            }

                            let newDom = `<script type='text/javascript'>${inlineData}</script>`
                            newDoms += newDom
                        } else {
                            // link链接形式
                            const publicPath = data.assets.publicPath
                            pathArr.forEach((path, index) => {
                                let linkPath = publicPath + path
                                let newScrpt = `<script type='text/javascript' src='${linkPath}'></script>`
                                newDoms += newScrpt
                            })
                        }
                    })
                }

                // 插入到head的最后
                let htmlArr = data.html.split('</head>')
                htmlArr[0] += newDoms
                data.html = htmlArr.join('</head>')

                callback(null, data)
            })
        })
    }
}

module.exports = HtmlWebpackIncludeJsPlugin
