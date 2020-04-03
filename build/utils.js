/*
 * @Date: 2019-08-19 16:21:35
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 16:29:25
 */
const glob = require('glob')
const fs = require('fs')
// 忽略不必要编译的文件
const entryIgnore = require('../entryignore.json')

/**
 * 获取最新dll文件
 * @param {*} path
 */
exports.getLatestFile = function (path) {
    let latestFile = ''
    let latestFileMtime = 0
    glob.sync(path).forEach(function (file) {
        let fileInfo = fs.statSync(file)
        let fileMtime = +new Date(fileInfo.mtime)

        latestFile = fileMtime > latestFileMtime ? file : latestFile
        latestFileMtime = fileMtime > latestFileMtime ? fileMtime : latestFileMtime
    })
    return latestFile.replace(/^.*\/(js\/|css\/)/ig, '$1')
}
/**
 * [获取文件列表(仅支持js和ejs文件)：输出正确的js和html路径]
 * @param  {[type]} globPath [description]
 * @return {[type]}          [description]
 */
exports.getEntry = function (globPath, splitDir) {
    let entries = {}
    glob.sync(globPath).forEach(function (entry) {
        // 排出相关入口文件
        if (entry.search(/notice|layouts|lib|naus|common|component/) === -1) {
            // 判断是js文件还是ejs文件
            let isEjsFile = entry.indexOf('.ejs') !== -1
            let dirArr = isEjsFile
                ? entry.split(splitDir)[1].split('.ejs')[0]
                : entry.split('/js/')[1].split('.')[0]
            // 排除忽略列表中的文件
            if (entryIgnore.indexOf(dirArr) === -1) {
                entries[dirArr] = entry
            }
        }
    })

    return entries
}
