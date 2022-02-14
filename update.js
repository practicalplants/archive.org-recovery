const { program } = require('commander');
const path = require('path');
const fs = require("fs-extra");
const readdirp = require("readdirp");

program
  .version("0.2.0")
  .arguments("<dir>");

program.parse(process.argv);

main(program);

const swaps = [
//   [/\s*\<div class="thanks-to" id="thanks-cernunnos".*?Cernunnos.\<\/p\>\s*\<\/div\>/ms,''],
//   [/\s*\<ul class="tabs"\>\s*\<li class="active"><a href="\/wiki">Plants Wiki<\/a><\/li>.*? accesskey="o">Log in<\/a><\/li>\s*<\/ul>\s*<\/div>\s*<\/div>/ms, ''],
//   [/\s*?<ul class="nav">\s*<li><a href="\/wiki\/">.*?<\/ul>\s*<ul class="nav pull-right">\s*<li id="search-nav">.*?<\/ul>/ms, ''],
//   [/<div id="article-state" class="article-state-box">.*?<\/div>/ms, ''],
//   [/<\/title>/ms, `</title>
//   <link rel="stylesheet" href="../_resources/fonts/crete-round/stylesheet.css" media="screen" />
//   <link rel="stylesheet" href="../_resources/css/global.css" media="screen" />
//   <link rel="stylesheet" href="../_resources/css/masthead.css" media="screen" />
//   <link rel="stylesheet" href="../_resources/css/inline-1.css" media="screen" />
//   <link rel="stylesheet" href="../_resources/css/load-1.css" media="screen" />
// `],
//   [/<article id="main-entry" class="wiki-entry">/ms, `<article id="main-entry" class="wiki-entry">
//   <div id="article-state" class="article-state-box">
//     <p>This is an archived copy of this article, recovered after a server failure in January 2022.</p>
//     <p>Some links may be broken, and editing is disabled. We are working to bring back full functionality.</p>
//   </div>
// `
//   ], 
  //<script src="http://practicalplants.org/w/load.php?debug=false&amp;lang=en&amp;modules=startup&amp;only=scripts&amp;skin=practicalplants&amp;*"></script>
  [/<link rel="EditURI" .*? \/>/ms, ''],
  [/<link rel="ExportRDF".*?\/>/ms, ''],
  [/<link rel="search" type="application\/opensearchdescription.*?\/>/, ''],
  [/\s*<script src="https?:\/\/practicalplants.org.*?<\/script>/msg, ''],
  [/<link rel="alternate" type="application\/atom.*?name="ResourceLoaderDynamicStyles" content="" \/>/ms, ''],
  [/<link rel="stylesheet" href="https?:\/\/practicalplants.org.*?\s\/>/msg, ''],
  [/<script>.*?<\/script>/msg, '']
]

async function main () {
  const dirPath = path.resolve(path.normalize(program.args[0]));

  const files = [];
  for await (const entry of readdirp(dirPath, {fileFilter: '*.html',   directoryFilter: ['!.git'], depth: 2, type: "files"})) {
    const {path, fullPath, basename} = entry;
    const htmlOrig = await fs.readFile(fullPath, "utf8");
    let html = htmlOrig

    swaps.forEach(swap => {
      html = html.replace(swap[0], swap[1])
    });

    if (html === htmlOrig) {
      continue;
    }
    await fs.writeFile(
      fullPath,
      html
    ).then(res => {
      console.log(`Wrote to ${fullPath}`)
    }).catch(()=>{
      console.log(`Error writing to ${fullPath}`)
    })

    // swaps.forEach(swap => {
    //   const match = html.match(swap[0]);
    //   if (match) {
    //     console.log('matched', match.index)
    //   }else {
    //     console.log('nomatch')
    //   }
    // })
  }
}