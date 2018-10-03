require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const PORT = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.json());



app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});