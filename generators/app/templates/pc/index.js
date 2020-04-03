const layout = require('<%= layoutPath %>')
const content = require('./<%= projectName %>.ejs')
const pageTitle = '<%= pageTitle %>'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
