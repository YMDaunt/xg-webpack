## 星光直播前后端分离 - 活动脚手架 (基于星光项目运行)

#### Prepare

```js
// 将 generators/package.json 中的依赖包配置 -> 拷贝添加到 项目根目录下的package.json中
```

```js
//  项目根目录下的package.json 中添加
// ./generators 表示xingguang/genarator项目目录
"scripts": {
    "new": "node node_modules/yo/lib/cli.js ./generators"
}
```

安装依赖

```bash
yarn install
```

#### Usage

```bash
yarn run new

# ? 请输入项目名称  - forTest(对应的所有文件名均为forTest)
# ? 请输入项目名称  - queen/forTest(二级目录项目) (支持多级目录)

# ? 请选择模板 (PC Mobile PC&Mobile)
```

#### Q&A

**当生成列表报告文件已存在时?**

> 需要手动确认文件名(项目名)是否重复

**需要更改生成的模板文件时?**

```javascript
// templates(基于ejs语法)
// -> generators-activity/generators/app/templates

// 模板参数
// -> index.js
```

![模板参数](C:\Users\Administrator\Desktop\note\imgs\yo.png)



#### Extendsion 扩展

**index.js - 脚手架入口文件**

```javascript
module.exports = class extends Generators {
    constructor (args, opts) {
        super(args, opts);

        this.props = {};
    }
    
    // 生命周期钩子函数
    /* 生命周期如下 */
    // 1. initializing
    // 2. prompting    // * 创建perl交互
    // 3. configuring
    // 4. default
    // 5. writing      // * 输入目录文件操作
    // 6. conflicts
    // 7. install
    // 8. end   
}
```

>this.prompt // 创建用户交互 依赖 inquirer.js
>
>this.fs // 文件操作 依赖 mem-fs-editor



##### Reference 参考

[yeoman](http://yeoman.io/generator/)

[inquirer.js](https://github.com/SBoudrias/Inquirer.js)

[mem-fs-editor](https://npm.taobao.org/package/mem-fs-editor)
