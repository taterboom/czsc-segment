const fs = require("node:fs/promises")
const path = require("node:path")
const mammoth = require("mammoth")
const markdownToc = require("markdown-toc")
const cheerio = require("cheerio")

mammoth.convertToHtml({ path: path.join(__dirname, "./缠中说禅全部博客内容.docx") }).then((res) => {
  fs.writeFile("缠中说缠-教你炒股票.html", generateHtml(res.value), "utf-8")
  // const matchRes = res.value.match(/<h1>/)
})
// .extractRawText({ path: path.join(__dirname, "./缠中说禅全部博客内容.docx") })
// .then((res) => {
//   const title = "缠中说缠-教你炒股票系列.md"
//   fs.access(title)
//     .then((res) => {
//       console.error(`"${title}" exists, remove it before generating.`)
//     })
//     .catch(() => {
//       fs.writeFile("缠中说缠-教你炒股票系列.md", generateMarkdown(res.value), "utf-8")
//     })
// })

function checkCurrentParaTitle(cheerioObj) {
  if (!cheerioObj || !cheerioObj.get(0)) return false
  if (cheerioObj.get(0).tagName === "h1") {
    return cheerioObj.text().includes("教你炒股票")
  } else {
    return checkCurrentParaTitle(cheerioObj.prev())
  }
}

function generateHtml(raw) {
  const $ = cheerio.load(raw)
  let htmlStr = ""
  $("body")
    .children()
    .each(function () {
      if ($(this).text().includes("教你炒股票")) {
        htmlStr += $.html($(this))
      } else if ($(this).get(0).tagName === "p" || $(this).get(0).tagName === "img") {
        if (checkCurrentParaTitle($(this).prev())) {
          htmlStr += $.html($(this))
        }
      }
    })
  return `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-lite-webfont@1.6.0/style.css"/>
    <style>
      html {
        background: rgb(226, 216, 184);
        font-family: LXGW WenKai Lite,sans-serif;
        line-height: 1.4;
      }
      body {
        margin: 16px auto;
        max-width: 768px;
      }
      img {
        max-width: 768px;
      }
    </style>
</head>
<body>
    ${htmlStr}
</body>
</html>`
}

// function generateMarkdown(raw) {
//   let mdText = raw
//     .split(/(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}.*\n\n)/)
//     .slice(1)
//     .reduce((total, chunk, index) => {
//       const totalIndex = Math.floor(index / 2)
//       if (index % 2 === 0) {
//         if (chunk.includes("教你炒股票")) {
//           total[totalIndex] = `## ${chunk.trim()}`
//         } else {
//           total[totalIndex] = ""
//         }
//       } else {
//         if (chunk.trim() && total[totalIndex]) {
//           total[totalIndex] += `\n> ${chunk.replace("\n\n", "\n").replace("html", "html\n")}`
//         } else {
//           total[totalIndex] = ""
//         }
//       }
//       return total
//     }, [])
//     .filter(Boolean)
//     .join("\n")
//   mdText = `<!-- toc -->\n` + mdText
//   mdText = markdownToc.insert(mdText)

//   return mdText
// }
