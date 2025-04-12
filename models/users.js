const db = require("../db/connection.js");
const bcrypt = require("bcrypt");

const { querySelectUsers, querySelectUserById, queryInsertUser} = require("../db/queries.js");

const selectAllUsers = () => {
  return db
    .query(querySelectUsers)
    .then((users) => {
      if (users.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }

      return users.rows;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

const selectUserById = (user_id) => {
    return db
    .query(querySelectUserById, [user_id])
    .then((user) => {
      if (user.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }

      return user.rows[0];
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}

const insertUser = (req) => {
    const {email, name, password_hash, image_url} = req.body;
    const saltRounds = 10;
    return bcrypt.hash(password_hash, saltRounds)
    .then((hashedPassword) => {
        return db
        .query(queryInsertUser, [email, name, hashedPassword, image_url])
        .then((user) => {
          return user.rows[0];
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    })
 

}

module.exports = { selectAllUsers, selectUserById, insertUser };
