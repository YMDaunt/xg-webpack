/*
 * @Date: 2019-08-16 09:17:47
 * @LastEditors: Jesse
 * @LastEditTime: 2019-09-03 14:39:41
 */
module.exports = {
    root: true,
    env: {
        browser: true,
        commonjs: true,
        es6: true
    },
    //定义全局变量
    globals: {
        window:true,//用于定义方法便于app调用
        _czc: true, //用于统计
        recharge:true,//安卓js对象
        swfobject:true,
        ActiveXObject:true,
        gBridge:true//ios android js对象
    },
    extends: [
        "eslint:recommended",
        "plugin:vue/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        // 使用javascript standard style, 覆盖前面的规则 https://standardjs.com/rules-zhcn.html#javascript-standard-style
        "standard"
    ],
    parserOptions: {
        parser: "babel-eslint",
        sourceType: "module"
    },
    plugins: ["vue"],
    rules: {
        // "import/no-unresolved": [2, {commonjs: true, amd: true}],
        "import/no-unresolved": 0,
        "import/namespace": 2,
        "import/default": 2,
        "import/export": 2,
        "indent": ["error", 4 ],
        "linebreak-style": "off",
        "no-console": "off",
        //new实例可以不赋值给变量，new Vue()
        "no-new": "off",
        // 是否禁止无用的表达式
        'no-unused-expressions': 0,
        // 取消禁止扩展原生对象
        "no-extend-native": 0,
        "camelcase": 1
    },
    settings: {
        // 使用webpack中配置的resolve路径
        "import/resolver": {
            alias:  [
                ['layer',  './xingguang/static_guojiang_tv/src/mobile/v2/js/lib/layer.js'],
                ['common',  './xingguang/static_guojiang_tv/src/mobile/v2/js/common/common.js'],
                // ['wxShare', catalog.entryDir + 'js/common/wxShare.js'],
                // ['report', catalog.entryDir + 'js/component/monitor/report.js'],
                // ['rsa', catalog.entryDir + 'js/component/rsa.js']
            ]

        }
    },
};
