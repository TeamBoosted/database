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
  id_token: Sequelize.STRING
});

const Medium = sequelize.define('medium', {
  title: Sequelize.STRING,
  creator: Sequelize.STRING,
  type: Sequelize.STRING,
  image: Sequelize.STRING,
  synopsis: Sequelize.STRING(2000),
  moviedb_id: Sequelize.INTEGER,
  popularity: Sequelize.DECIMAL,
  vote_avg: Sequelize.DECIMAL,
  vote_count: Sequelize.INTEGER
});

const User_Media = sequelize.define('user_media', {
  rating: Sequelize.INTEGER
});

User.belongsToMany(Medium, { through: User_Media });
Medium.belongsToMany(User, { through: User_Media });

User.sync({ force: true })
  .then(() => {
    return Medium.sync({ force: true });
  })
  .then(() => {
    return User_Media.sync({ force: true });
  })
  .then(() => {
    const testmedium = Medium.build({
      title: 'Inception',
      creator: 'Bruce Willis',
      type: 'TV Show',
      image: 'www.idiehardmoveposter.com',
      synopsis: 'Ki yay within a yippe',
      moviedb_id: 12345,
      popularity: 10,
      vote_avg: 3.142,
      vote_count: 9000
    });
    return testmedium.save()
  })
  .then((testmedium) => {
    const testUser = User.build({
      id_token: 'auth0|12345'
    });
    return testUser.save().then((testUser) => {
      testUser.addMedium(testmedium);
    })
  })
  .then(() => {
    return User.findAll().then(data => console.log(data[0].dataValues));
  })
  .then(() => {
    return Medium.findAll().then(data => console.log(data[0].dataValues));
  })
  .catch(console.log);

const addUser = (id_token) => {
  const testuser = User.build({ id_token });
  return testuser.save();
};

const addMedium = (mediumObj) => {
  const testmedium = Medium.build(mediumObj);
  return testmedium.save();
};

const findOneUserByToken = (id_token) => {
  const testOneUser = User.findOne({ attributes: ['id'], where: { id_token } });
  return testOneUser;
};

module.exports = { addUser, addMedium, findOneUserByToken };
// Medium.sync({ force: true }).then(() => {
//   return Medium.create({
//     title: 'Inception',
//     creator: 'Bruce Willis',
//     type: 'TV Show',
//     image: 'www.diehardmoveposter.com',
//     synopsis: 'Dreams within a dream',
//     moviedb_id: 12345,
//     popularity: 7.4,
//     vote_avg: 3.4,
//     vote_count: 9000
//   })
//     .catch(console.log);
// });

// User.findAll().then(data => {
//   console.log('find all users', data[0].dataValues);
// }).catch(console.log);

// Medium.findAll().then(data => {
//   console.log('find all media', data[0].dataValues);
// }).catch(console.log);