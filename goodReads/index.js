const axios = require('axios');
const cheerio = require('cheerio');

const getLinksByGenre = async (genre) => {
  try {
    const searchUrl = `https://www.goodreads.com/genres/${genre}`;
    const html = await axios.get(searchUrl);
    const $ = cheerio.load(html.data);
    const elements = $('.coverWrapper');
    let arr = [];
    elements.each((index, el) => {
      arr.push(el.children[1].attribs.href);
    });
    return arr;
  } catch (err) {
    console.log(err);
  }
};

const getEachBookData = async (endpoint) => {
  try {
    const searchUrl = `https://www.goodreads.com${endpoint}`;
    const html = await axios.get(searchUrl);
    const $ = cheerio.load(html.data);
    const title = $('#bookTitle').text().replace(/\s/g, '');
    const synopsis = $('#description').children().first().text();
    const vote_avg = $('.average').text();
    const vote_count = $('.count.value-title').text().replace(/\s/g, '');
    const popularity = Number($('.votes.value-title').text().replace(/\s/g, '')) + Number(vote_count);
    const image = $('#coverImage').attr('src');
    const moviedb_id = endpoint.replace(/[^\d]/g, '');
    return { title, synopsis, vote_avg, vote_count, popularity, image, moviedb_id, type: 'book' };
  } catch (err) {
    console.log(err)
  }
};

const scrapeGR = async () => {
  try {
    const bookLinks = await getLinksByGenre('action');
    const bookData = await getEachBookData(bookLinks[1]);
    console.log(bookData);
  } catch (err) {
    console.log(err);
  }
};

scrapeGR();
