const Generators = require('yeoman-generator');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const log = console.log;
const config = require('./config.yo');

module.exports = class extends Generators {
    constructor (args, opts) {
        super(args, opts);

        this.props = {};
    }

    /**
     * @desc 询问用户
     */
    prompting () {
        this.log(chalk.green('Check Your Configuration Path Avaiable. Please Wait...'));
        if (!this._prepare()) {
            process.exit(1);
        }

        return this.prompt([{
            name: 'pName',
            type: 'input',
            message: '请输入项目名称',
            default: 'myProject'
        }, {
            name: 'pAssets',
            type: 'list',
            message: '请选择模板',
            choices: [{
                name: 'PC & Mobile',
                value: ['PC', 'Mobile'],
                checked: true
            }, {
                name: 'PC',
                value: ['PC']
            }, {
                name: 'Mobile',
                value: ['Mobile']
            }]
        }, {
            name: 'pTitle',
            type: 'input',
            message: '请输入页面标题',
            default: 'pageTitle'
        }]).then((answers) => {
            this.log('Your Project Name (Dir & File name): ', answers.pName);
            this.log('Your Project Template Type: ', answers.pAssets);

            /* 打印输出目录 */
            this.log(chalk.green('Please Confirm Your Project Output Path: '));

            // let pathname = path.dirname(answers.pName);
            let filename = path.basename(answers.pName);

            let files = {
                'ejs': answers.pName + '.ejs',
                'ejs_js': answers.pName + '.js',
                'less': answers.pName + '.less',
                'js': answers.pName + '.js',
            };

            this.props = answers;
            this.props.filename = filename;
            this.props.path = {};
            
            /* 获取路径列表 */
            answers.pAssets.forEach((type) => {
                this._getPaths(type, files);
            });

        }).then(() => {
            /* 确定这些文件的是否已经存在了 */
            this.props.pAssets.forEach((type) => {
                for (let key in this.props.path[type]) {
                    let path = this.props.path[type][key];
                    let existed = this.fs.exists(path);
                    
                    if (existed) {
                        this.log(chalk.red('File Existed : ', path));
                        this.log(chalk.red('Please Ensure The Project Can be Overwrited!'));
                        this.log(chalk.red('Exit...'));
                        process.exit(1);
                    }
                }
            });
            
            return this.prompt([{
                name: 'pathConfirm',
                type: 'confirm',
                message: 'The OutputPath above is Ok?',
                default: true
            }]);

        }).then((confirm) => {
            if (!confirm.pathConfirm) {
                this.log(chalk.red('You Change The Output Path in generator/generators/app/config.yo.js'));
                this.log(chalk.red('Exit...'));
                process.exit(1);
            }
        });
    }

    /**
     * @desc 创建配置文件
     */
    configuring () {
    }

    /**
     * @desc 拷贝文件，搭建脚手架
     */
    writing () {
        this.props.pAssets.forEach((type) => {
            this._writeByType(type, this.props.path[type]);
        });
    }

    end () {
        log(chalk.green('generator success'));
    }

    /**
     * 先行配置检查
     */
    _prepare () {
        const paths = {
            'HTML Base Path': path.resolve(config.outputHtmlDir),
            'Static Resource Base Path': path.resolve(config.outputStaticDir),

            'HTML Relative Path For PC': path.resolve(config.outputHtmlDir, config.outputHtmlPCDir),
            'HTML Relative Path For Mobile': path.resolve(config.outputHtmlDir, config.outputHtmlMobileDir),

            'Static Resource Relative Path For PC(JS)': path.resolve(config.outputStaticDir, config.outputStaticPCDirForJS),
            'Static Resource Relative Path For PC(LESS)': path.resolve(config.outputStaticDir, config.outputStaticPCDirForStyles),
            'Static Resource Relative Path For PC(IMG)': path.resolve(config.outputStaticDir, config.outputStaticPCDirForImgs),
            
            'Static Resource Relative Path For Mobile(JS)': path.resolve(config.outputStaticDir, config.outputStaticMobileDirForJS),
            'Static Resource Relative Path For Mobile(LESS)': path.resolve(config.outputStaticDir, config.outputStaticMobileDirForStyles),
            'Static Resource Relative Path For Mobile(IMG)': path.resolve(config.outputStaticDir, config.outputStaticMobileDirForImgs),
        };

        for (let p in paths) {
            try {
                fs.accessSync(paths[p]);
            } catch (err) {
                this.log(chalk.red('Error: ') + p + ': NOT EXIST! - ' + paths[p]);
                return false;
            }
        }

        return true;
    }

    /**
     * 获取文件路径表
     * @param {*} type // PC / Mobile
     * @param {*} files // 文件表
     */
    _getPaths (type, files) {
        this.props.path[type] = {
            'ejs': path.resolve(config.outputHtmlDir, config['outputHtml'+ type +'Dir'], files['ejs']),
            'ejs_js': path.resolve(config.outputHtmlDir, config['outputHtml'+ type +'Dir'], files['ejs_js']),
            'imgs': path.resolve(config.outputStaticDir, config['outputStatic'+ type +'DirForImgs'], this.props.pName),
            'less': path.resolve(config.outputStaticDir, config['outputStatic'+ type +'DirForStyles'], files['less']),
            'js': path.resolve(config.outputStaticDir, config['outputStatic'+ type +'DirForJS'], files['js'])
        };

        this.log(chalk.green('**** '+ type +' ****'));

        this.log(chalk.green('---- ejs ----'));
        this.log(chalk.blue(this.props.path[type]['ejs']));
        this.log(chalk.blue(this.props.path[type]['ejs_js']));

        this.log(chalk.green('---- static imgs ----'));
        this.log(chalk.blue(this.props.path[type]['imgs'])); // imgs一定是单独目录的存在
        
        this.log(chalk.green('---- static less ----'));
        this.log(chalk.blue(this.props.path[type]['less']));

        this.log(chalk.green('---- static js ----'));
        this.log(chalk.blue(this.props.path[type]['js']));
    }

    /**
     * 根据PC/Mobile -> Path 写入对应的模板文件
     * @param {*} type // PC / Mobile
     * @param {*} paths // 路径表
     */
    _writeByType (type, paths) {
        this._ensurePathDir(paths);

        // 创建模板文件 ejs
        this.fs.copyTpl(
            this.templatePath(path.resolve(this.sourceRoot(), './' + type.toLowerCase() + '/index.ejs' )),
            paths['ejs'],
            {
                imgPath: path.relative(path.dirname(paths['ejs']), paths['imgs']).replace(/\\/g, '/'),
                shareTitle: 'shareTitle',
                shareContent: 'shareContent'
            }
        );

        // 创建模板引擎文件 ejs_js
        let layoutPath = '';
        if (type.toLowerCase() === 'mobile') {
            layoutPath = path.relative(path.dirname(paths['ejs_js']), path.resolve(config.outputHtmlDir, config.outputHtmlMobileDir, './layouts/layout.js'));
        }
        if (type.toLowerCase() === 'pc') {
            layoutPath = path.relative(path.dirname(paths['ejs_js']), path.resolve(config.outputHtmlDir, config.outputHtmlPCDir, './layouts/layout.js'));
        }

        this.fs.copyTpl(
            this.templatePath(path.resolve(this.sourceRoot(), './' + type.toLowerCase() + '/index.js' )),
            paths['ejs_js'],
            {
                layoutPath: layoutPath.replace(/\\/g, '/'),
                projectName: this.props.filename,
                pageTitle: this.props.pTitle,
            }
        );

        // 创建活动存放图片的目录
        this._mkdirPSync(paths['imgs']);
        this.log(chalk.green('   create '), paths['imgs']);

        // 创建样式文件
        this.fs.copyTpl(
            this.templatePath(path.resolve(this.sourceRoot(), './' + type.toLowerCase() + '/styles/style.less' )),
            paths['less'],
            {
                projectName: this.props.pName,
                imgPath: path.relative(path.dirname(paths['less']), paths['imgs']).replace(/\\/g, '/')
            }
        );

        // 创建脚本文件
        this.fs.copyTpl(
            this.templatePath(path.resolve(this.sourceRoot(), './' + type.toLowerCase() + '/scripts/main.js' )),
            paths['js'],
            {
                stylePath: path.relative(path.dirname(paths['js']), paths['less']).replace(/\\/g, '/')
            }
        );
    }

    /**
     * 确定文件目录是否需要新建
     * @param {{any}} paths 
     */
    _ensurePathDir (paths) {
        // 确立ejs目录
        try {
            fs.accessSync(path.dirname(paths['ejs']));
        } catch (err) {
            this._mkdirPSync(path.dirname(paths['ejs']));
        }

        // ejs_js 与 js 同目录，无需重复确认

        try {
            fs.accessSync(path.dirname(paths['less']));
        } catch (err) {
            this._mkdirPSync(path.dirname(paths['less']));
        }

        try {
            fs.accessSync(path.dirname(paths['js']));
        } catch (err) {
            this._mkdirPSync(path.dirname(paths['js']));
        }
    }

    /**
     * 支持嵌套创建目录
     * @param {*} paths 
     */
    _mkdirPSync (dir) {
        try {
            fs.accessSync(dir); // 该目录已存在
        } catch (err) {
            try {
                fs.accessSync(path.dirname(dir)); // 父级是否存在
            } catch (err) {
                this._mkdirPSync(path.dirname(dir));
            }
            fs.mkdirSync(dir);
        }
    }
};
