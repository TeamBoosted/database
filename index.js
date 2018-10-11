require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const cors = require('cors');
const PORT = process.env.PORT || 8081;

const app = express();
// app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('blah');
});

app.post('/db/users/signup', (req, res) => {
  let { id_token } = req.body;
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
  let { mediumObj, id_token } = req.body;
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
  let { genreList } = req.body;
  db.addMedium(genreList)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.post('/db/users/getUserByToken', (req, res) => {
  let { id_token } = req.body;
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
  let { id_token } = req.body;
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

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});