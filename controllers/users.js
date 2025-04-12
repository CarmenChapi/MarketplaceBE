const { selectAllUsers, selectUserById, insertUser} = require("../models/users")


exports.getAllUsers = (req, res, next) => {

  selectAllUsers()
        .then(users => {
        res.status(200).send({ users });
      })
     
      .catch(err => {console.log(err)
       next(err)})
    }

exports.getUserById = (req, res, next) => {
    const {user_id } = req.params;
      selectUserById(user_id)
            .then(user => {
            res.status(200).send({ user });
          })
         
          .catch(err => {console.log(err)
           next(err)})
        }

exports.postUser = (req, res, next) => {
    console.log("chilling in the controller")

      insertUser(req)
            .then(user => {
            res.status(201).send({ user });
          })
         
          .catch(err => {console.log(err)
           next(err)})
        }
