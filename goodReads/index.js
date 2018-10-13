const axios = require('axios');
const cheerio = require('cheerio');

module.exports.scrapeGR = async () => {
  let genre = 'drama';
  const searchUrl = `https://www.goodreads.com/genres/${genre}`;
  const html = await axios.get(searchUrl);
  const $ = await cheerio.load(html.data);

  const elements = await $('.coverWrapper');
  let arr = [];
  elements.each((index, el) => {
    arr.push(el.children[1].attribs.href);
    // console.log(el.children[1].attribs.href);
  });
  console.log(arr);
};
