const fs = require("node:fs/promises")
const path = require("node:path")
const mammoth = require("mammoth")
const markdownToc = require("markdown-toc")

mammoth
  //   .convertToHtml({ path: path.join(__dirname, "../缠中说禅全部博客内容.docx") })
  //   .then((res) => {
  //     fs.writeFile("output.html", res.value, "utf-8")
  //     const matchRes = res.value.match(/<h1>/)
  //   })
  .extractRawText({ path: path.join(__dirname, "./缠中说禅全部博客内容.docx") })
  .then((res) => {
    const title = "缠中说缠-教你炒股票系列.md"
    fs.access(title)
      .then((res) => {
        console.error(`"${title}" exists, remove it before generating.`)
      })
      .catch(() => {
        fs.writeFile("缠中说缠-教你炒股票系列.md", generateMarkdown(res.value), "utf-8")
      })
  })

function generateMarkdown(raw) {
  let mdText = raw
    .split(/(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}.*\n\n)/)
    .slice(1)
    .reduce((total, chunk, index) => {
      const totalIndex = Math.floor(index / 2)
      if (index % 2 === 0) {
        if (chunk.includes("教你炒股票")) {
          total[totalIndex] = `## ${chunk.trim()}`
        } else {
          total[totalIndex] = ""
        }
      } else {
        if (chunk.trim() && total[totalIndex]) {
          total[totalIndex] += `\n> ${chunk.replace("\n\n", "\n").replace("html", "html\n")}`
        } else {
          total[totalIndex] = ""
        }
      }
      return total
    }, [])
    .filter(Boolean)
    .join("\n")
  mdText = `<!-- toc -->\n` + mdText
  mdText = markdownToc.insert(mdText)

  return mdText
}
