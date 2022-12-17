const fs = require("node:fs/promises")
const cheerio = require("cheerio")

function generate(text, title, flag) {
  const html = generateHtml(text, title, flag)
  fs.writeFile(`${title}.html`, html, "utf-8")
}

function checkCurrentParaTitle(cheerioObj, flag) {
  if (!cheerioObj || !cheerioObj.get(0)) return false
  if (cheerioObj.get(0).tagName === "h1") {
    return cheerioObj.text().includes(flag)
  } else {
    return checkCurrentParaTitle(cheerioObj.prev(), flag)
  }
}

function generateHtml(raw, title, flag) {
  const $ = cheerio.load(raw)
  let htmlStr = ""
  $("body")
    .children()
    .each(function () {
      if ($(this).text().includes(flag)) {
        htmlStr += $.html($(this))
      } else if ($(this).get(0).tagName === "p" || $(this).get(0).tagName === "img") {
        if (checkCurrentParaTitle($(this).prev(), flag)) {
          htmlStr += $.html($(this))
        }
      }
    })
  return `<html lang="en">
<head>
    <title>${title}</title>
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
        margin: 1em auto;
        max-width: 768px;
        padding: 1em;
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

module.exports = {
  generate,
}
