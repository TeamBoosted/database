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
  id_token: { 
    type:Sequelize.STRING(2000),
    unique: true
  }
});

const Medium = sequelize.define('medium', {
  title: Sequelize.STRING,
  creator: Sequelize.STRING,
  type: Sequelize.STRING,
  image: Sequelize.STRING,
  synopsis: Sequelize.STRING(2000),
  moviedb_id: {
    type:Sequelize.INTEGER,
    unique:true
  },
  popularity: Sequelize.DECIMAL,
  vote_avg: Sequelize.DECIMAL,
  vote_count: Sequelize.INTEGER
});

const Genre = sequelize.define('genre',{
  genre_id: {
    type:Sequelize.INTEGER,
    unique:true
  },
  name: Sequelize.STRING
});

const User_Genre = sequelize.define('user_genre',{
  genre_score: {
    type:Sequelize.INTEGER,
    defaultValue: 0
  }  
});

const Medium_Genre = sequelize.define('medium_genre', {});


const User_Media = sequelize.define('user_media', {
  rating: Sequelize.INTEGER
});


User.belongsToMany(Medium, { through: User_Media });
Medium.belongsToMany(User, { through: User_Media });

Genre.belongsToMany(User, { through: User_Genre });
User.belongsToMany(Genre, { through: User_Genre });

Genre.belongsToMany(Medium, { through: Medium_Genre });
Medium.belongsToMany(Genre,{ through: Medium_Genre });



const addUser = (id_token) => {
  const testuser = User.create({ id_token });
  return testuser;
};

const addMedium = (mediumObj, id_token) => {
  return Medium.create(mediumObj)
    .then(medium => {
      return findOneUserByToken(id_token)
        .then(user => {
          if (!user) {
            return addUser(id_token)
              .then(user => {
                return user.addMedium(medium);
              })
          } else {
            return user.addMedium(medium);
          }
        })
    })
    .catch(console.log);
};

const addGenre = (genre_id) => {
  // genreList.forEach(genre => {
  //   Genre.upsert({genre_id: genre}) 
  // })
  return Genre.upsert({genre_id})
  // return Promise.all([
  //   Genre.upsert({genre_id: genreList[0]}),
  //   Genre.upsert({genre_id: genreList[1]}),
  //   Genre.upsert({genre_id: genreList[2]})
  // ]);
};

const addGenreToUser = async(genreList, id_token) => {
  const user = await findOneUserByToken(id_token);
  const userId = user.dataValues.id;

  genreList.forEach((genre_id, index) => {
    return Genre.upsert({ genre_id })
      .then(genreResults => {
        if (!genreResults) {
          findOneGenreByID(genre_id)
            .then(results => {
              const genreId = results.dataValues.id;
              User_Genre.upsert({ genreId, userId})
                .then(user_genre_results => {
                  if(!user_genre_results) {
                    findOneUserAndGenreRelation(userId, genreId)
                    .then(data => {
                      let score = genreList.length - index;
                      data.increment('genre_score', { by: score});
                    })
                  }
                })
              })
        } else {
          findOneGenreByID(genre_id)
          .then(results => {
            const genreId = results.dataValues.id;
            User_Genre.upsert({ genreId, userId })
          })
        }
      })
    })
};


const addGenreToMedium = async(genreList, id) => {
  const medium = await findOneMediumByID(id);
  const mediumId = medium.dataValues.id;
  genreList.forEach(genre_id => {
    Genre.upsert({ genre_id })
    .then(results => {
      findOneGenreByID(genre_id)
      .then(genre => {
        const genreId = genre.dataValues.id;
        return Medium_Genre.upsert({genreId, mediumId})
      })
    })
    .catch(console.log);
  })
};

const findOneUserAndGenreRelation = (userId, genreId) => {
  const testGenreUser = User_Genre.findOne({ where: { userId, genreId } });
  return testGenreUser;
}

const findOneUserByToken = (id_token) => {
  const testOneUser = User.findOne({ where: { id_token } });
  return testOneUser;
};

const findOneMediumByID = (moviedb_id) => {
  const testOneMedium = Medium.findOne({ where: { moviedb_id } });
  return testOneMedium;
};

const findOneGenreByID = (genre_id) => {
  const testOneGenre = Genre.findOne({ where: { genre_id } });
  return testOneGenre;
};

const getLastThreeMedia = (id_token) => {
  return User.findOne({ where: { id_token } })
    .then(user => {
      return user.getMedia({ limit: 3, order: [['createdAt', 'DESC']] });
    })
};

const getTopThreeGenres = async (id_token) => {
  const user = await findOneUserByToken(id_token);
  const userId = user.dataValues.id;
  return User_Genre.findAll({ where: { userId }, limit: 3, order: [['genre_score', 'DESC']]})
};
<<<<<<< HEAD

=======
>>>>>>> 96314bd1b364c4f5ebc4854bb2575722b945fc6a
// addMedium(myObj,'1')
// addGenre(
//   [{genre_id:2000,
//   name:'comedy'},
//   {genre_id:16,
//     name:'horror'},
//     {genre_id:17,
//       name:'drama'}])

// findOneGenreByID(111)
// .then(data=>console.log(data))
// addGenreToUser([ {genre_id:111,name:'test'},{genre_id:2222,name:'boom'}],'2')

// addGenreToMedium({genre_id:19,name:'testingGM'},1)

// console.log(findOneUserAndGenreRelation(2,14))

// findOneUserAndGenreRelation(2, 3).then( data => {
//   console.log('test find one user and genre =================>', data)
//   data.increment('genre_score', {by: 1})
// })
// addGenreToMedium([28, 53, 878], 27205);

<<<<<<< HEAD
module.exports = { addUser, addMedium, findOneUserByToken, getLastThreeMedia, addGenre, findOneMediumByID, addGenreToMedium, addGenreToUser, findOneGenreByID, findOneUserAndGenreRelation, getTopThreeGenres };

=======
module.exports = { addUser, addMedium, findOneUserByToken, getLastThreeMedia, addGenre, findOneMediumByID, addGenreToMedium, addGenreToUser, findOneGenreByID, findOneUserAndGenreRelation };
module.exports.getTopThreeGenres = async (id_token) => {
  const user = await findOneUserByToken(id_token);
  const userId = user.dataValues.id;
  return User_Genre.findAll({ where: { userId }, limit: 3, order: [['genre_score', 'DESC']]})
};
>>>>>>> 96314bd1b364c4f5ebc4854bb2575722b945fc6a

// User.sync({ force: true })
//   .then(() => {
//     return Medium.sync({ force: true });
//   })
//   .then(() => {
//     return Genre.sync({ force: true });
//   })
//   .then(() => {
//     return User_Media.sync({ force: true });
//   })
//   .then(() => {
//     return User_Genre.sync({ force: true });
//   })
//   .then(() => {
//     return Medium_Genre.sync({ force: true });
//   }) 
//   .then(() => {
//     const testUser = User.build({
//       id_token: 'auth0|12345'
//     });
//     return testUser.save();
//   })
//   .then(user => {
//     const testmedium = Medium.build({
//       title: 'Inception0',
//       creator: 'Bruce Willis',
//       type: 'TV Show',
//       image: 'www.idiehardmoveposter.com',
//       synopsis: 'Ki yay within a yippe',
//       moviedb_id: 12345,
//       popularity: 10,
//       vote_avg: 3.142,
//       vote_count: 9000
//     })
//     return testmedium.save();
//   })
//   .then(medium => {
//     User.findById(1)
//       .then(user => {
//         user.addMedium(medium);
//       }).catch(console.log);
//   })
//   .then(() => {
//     const testGenre = Genre.build({
//       genre_id: 12,
//       name: 'action'
//     })
//     return testGenre.save()
//   })
//   .then(() => {
//     return User.findAll().then(data => console.log(data[0].dataValues));
//   })
//   .then(() => {
//     return Medium.findAll().then(data => console.log(data[0].dataValues));
//   })
//   .then(()=>{
//     return Genre.findAll().then(data=>console.log(data[0].dataValues))
//   })
//   .catch(console.log);




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