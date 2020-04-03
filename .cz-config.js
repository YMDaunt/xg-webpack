/*
 * @Date: 2019-09-05 09:10:32
 * @LastEditors: Jesse
 * @LastEditTime: 2019-09-05 17:38:22
 */
//https://www.npmjs.com/package/cz-customizable
module.exports = {
    //提交类型
    types: [
        { value: 'feat', name: 'feat:     A new feature' },
        { value: 'fix', name: 'fix:      A bug fix' },
        { value: 'docs', name: 'docs:     Documentation only changes' },
        {
            value: 'style',
            name:
                'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)',
        },
        {
            value: 'refactor',
            name: 'refactor: A code change that neither fixes a bug nor adds a feature',
        },
        {
            value: 'perf',
            name: 'perf:     A code change that improves performance',
        },
        { value: 'test', name: 'test:     Adding missing tests' },
        {
            value: 'chore',
            name:
                'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation',
        },
        { value: 'revert', name: 'revert:   Revert to a commit' },
        { value: 'merge', name: 'merge:   Merge branch to a commit' },
    ],
    // 影响范围，修改了哪些模块
    // scopes: [
    //     { name: '当前活动' },
    //     { name: '公共模块' },
    //     { name: '版本' }
    // ],

    // override the messages, defaults are as follows
    messages: {
        type: "Select the type of change that you're committing:",
        scope: '\nDenote the SCOPE of this change (optional):',
        // used if allowCustomScopes is true
        customScope: 'Denote the SCOPE of this change:',
        subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
        body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
        breaking: 'List any BREAKING CHANGES (optional):\n',
        footer: 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
        confirmCommit: 'Are you sure you want to proceed with the commit above?',
    },

    allowCustomScopes: true,
    // skip any questions you want
    skipQuestions: ['scope','body','breaking','footer'],

    // limit subject length
    subjectLimit: 100,
};
