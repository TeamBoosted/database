require('dotenv').config();
const Sequelize = require('sequelize');
const PG_URL = process.env.PG_URL || `postgres://${process.env.PG_USER}:${process.env.PG_PASS}@localhost:5432/test`
const sequelize = new Sequelize(PG_URL);

sequelize.authenticate()
  .then(() => {
    console.log('Connected to db');
  })
  .catch(console.log);

const User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  }
});

// User.create({
//   firstName: 'Michael',
//   lastName: 'Thomson'
// }).catch(console.log);

User.findAll().then(data => {
  console.log('find all', data[0].dataValues.firstName, data[1].dataValues.firstName);
}).catch(console.log);

