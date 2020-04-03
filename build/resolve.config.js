/*
 * @Date: 2019-08-16 09:19:29
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 16:20:33
 */
var path = require('path')
const catalog = require('./catalog')

const vueSource = process.env.NODE_ENV === 'production' ? path.resolve(__dirname, './../node_modules/vue/dist/vue.min.js') : path.resolve(__dirname, './../node_modules/vue/dist/vue.js')

module.exports = {
    // 模块别名的配置，为了使用方便，一般来说所有模块都是要配置一下别名的
    alias: {
        'vue': vueSource,
        'axios': catalog.entryDir + 'js/lib/axios.min.js',
        'layer': catalog.entryDir + 'js/lib/layer.js',
        'common': catalog.entryDir + 'js/common/common.js',
        'wxShare': catalog.entryDir + 'js/common/wxShare.js',
        'guide': catalog.entryDir + 'js/common/guide.js',
        'report': catalog.entryDir + 'js/component/monitor/report.js',
        'rsa': catalog.entryDir + 'js/component/rsa.js',
        'user': catalog.entryDir + 'js/common/user.js',
        'component': catalog.entryDir + 'js/common/gj.component.js'
        // 'dll': path.resolve(__dirname, '../static_guojiang_tv/src/mobile/v2/js/lib/dll.js')
    },

    // 当require的模块找不到时，尝试添加这些后缀后进行寻找
    extensions: ['.js', '.css', '.less', '.vue', '.json']
}
