const path = require("node:path")
const mammoth = require("mammoth")
const { generate } = require("./utils")

mammoth.convertToHtml({ path: path.join(__dirname, "./缠中说禅全部博客内容.docx") }).then((res) => {
  generate(res.value, "缠中说缠-论语", "《论语》详解")
})
