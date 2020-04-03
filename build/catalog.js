/*
 * @Date: 2019-08-16 10:08:32
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-30 10:36:41
 */
const path = require('path')

let baseEntryDir
let baseOutputDir
let basePageEntryDir
let basePageOutputDir
let entryDir
let outputDir
let outputPublicDir
let pageEntry
let pageOutput
let entries
let dllManifestName
let cleanOptions
let vendorManifestName
let cleanDir
let inlineSource
let host
let target
let basePath = path.resolve(__dirname, '../xingguang')

// 是否是生产环境
const prod = process.env.NODE_ENV === 'production'
// 是否是pc编译
const isPc = process.env.PLATFORM === 'pc'

if (isPc) {
    // PC目录配置
    console.log('***********************PC编译*************************')
    baseEntryDir = '/static_guojiang_tv/src/pc/v4/'
    baseOutputDir = '/static_guojiang_tv/pc/v4/'
    basePageEntryDir = '/html/pc/src/'
    basePageOutputDir = '/html/pc/dist/'
    outputPublicDir = '//static.guojiang.tv/pc/v4/'
    entryDir = basePath + baseEntryDir
    inlineSource = [
        entryDir + 'js/component/monitor/globalMonitor.js'
    ]
    dllManifestName = 'dll_pc_manifest'
    vendorManifestName = 'vendor_pc_manifest'
    host = 'www.tuho.tv'
    target = 'https://www.tuho.tv'
} else {
    console.log('***********************触屏版编译***********************')
    baseEntryDir = '/static_guojiang_tv/src/mobile/v2/'
    baseOutputDir = '/static_guojiang_tv/mobile/v2/'
    basePageEntryDir = '/html/mobile/src/'
    basePageOutputDir = '/html/mobile/dist/'
    outputPublicDir = '//static.guojiang.tv/mobile/v2/'
    entryDir = basePath + baseEntryDir
    inlineSource = [
        entryDir + 'js/component/flexible.js',
        entryDir + 'js/component/monitor/globalMonitor.js'
    ]
    dllManifestName = 'dll_manifest'
    vendorManifestName = 'vendor_manifest'
    host = 'm.tuho.tv'
    target = 'https://m.tuho.tv'
}
outputDir = basePath + baseOutputDir
pageEntry = basePath + basePageEntryDir
pageOutput = basePath + basePageOutputDir
cleanOptions = {
    root: outputDir,
    exclude: [
        'lib',
        'vendor'
    ]
}
// clean folder
cleanDir = [
    outputDir + 'css',
    outputDir + 'js'
]

module.exports = {
    baseEntryDir,
    baseOutputDir,
    basePageEntryDir,
    basePageOutputDir,
    entryDir,
    outputDir,
    outputPublicDir,
    pageEntry,
    pageOutput,
    entries,
    dllManifestName,
    vendorManifestName,
    cleanOptions,
    cleanDir,
    prod,
    host,
    target,
    inlineSource
}
