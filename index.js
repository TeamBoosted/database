require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const cors = require('cors');
const PORT = process.env.PORT || 8081;
const { scrapeGR } = require('./goodReads');

const app = express();
// app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('blah');
});

app.post('/db/users/signup', (req, res) => {
  const { id_token } = req.body;
  db.addUser(id_token)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.post('/db/addMedium', (req, res) => {
  const { mediumObj, id_token } = req.body;
  db.addMedium(mediumObj, id_token)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.post('/db/addGenre', (req, res) => {
  const { genre_ids, id_token } = req.body;
  db.addGenreToUser(genre_ids, id_token)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.post('/db/users/getUserByToken', (req, res) => {
  const { id_token } = req.body;
  db.findOneUserByToken(id_token)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    })
});

app.post('/db/getLastThreeMedia', (req, res) => {
  const { id_token } = req.body;
  db.getLastThreeMedia(id_token)
    .then(data => {
      let massaged = data.map(el => {
        delete el.dataValues.user_media;
        return el.dataValues;
      });
      res.json(massaged);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    })
});

app.post('/db/getTopGenres', (req, res) => {
  const { id_token } = req.body;
  db.getTopThreeGenres(id_token)
    .then(data => {
      const body = [];
      data.forEach(result => {
        const { genre_score, genreId } = result.dataValues;
        body.push({ genre_score, genreId });
      });
      res.send(body);
    })
    .catch(err => {
      console.log('----------\nError getting Top Genres\n----------\n', err);
      res.sendStatus(500);
    })
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

scrapeGR();