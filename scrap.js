const axios = require("axios")
const cheerio = require("cheerio")
const fs = require("fs")

let names = [
  `Niels Bohr`,
  `Marie Curie`,
  `Albert Einstein`,
  `Isaac Newton`,
  `Galileo Galilei`,
  `James Clerk Maxwell`,
  `Michael Faraday`,
  `Richard Feynman`,
  `Ernest Rutherford`,
  `Paul Dirac`
]


//cojo las urls que quiero visitar
let URLS = names.map(name => `https://es.wikipedia.org/wiki/${name.replace(/ /gi, "_")}`)


let scientists = []

//visitamos las URLS y accedemos al codigo fuente de wikipedia y operamos sobre él
Promise.all(URLS.map(URL => axios.get(URL))).then(allPages => {
  allPages.forEach((page, scientistsIndex) => {
    cheerio
    .load(page.data)(".infobox.biography.vcard tr")
    .each((index, val) => {
      let row = cheerio.load(val)

      if(row.html().indexOf("Fallecimiento") > -1){
        let agePosition = row.html().search(/\([1-9][0-9]/g);

        scientists.push({
          name: names[scientistsIndex],
          age: +row.html().substring(agePosition +1, agePosition + 3)
        })
        // console.log(scientists)
      }
    });
  });
  scientists.sort((a,b) => {
    if (a.age > b.age) return 1;
    if(a.page < b.page) return -1;
  });
  console.log(scientists)

  //grabamos un archivo para guardar una versión reducida de los scientists

  fs.writeFile("output.html", JSON.stringify(scientists), function (err, data) {
    console.log('recorded!')
  })
});


// obtengo el cógigo fuente de la página Wikipedia 
// axios.get(URLS[0]).then(wikipediaPage => {
//   console.log(wikipediaPage.data)
// })

