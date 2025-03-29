const { selectAllUsers} = require("../models/users")


exports.getAllUsers = (req, res, next) => {
console.log("chilling in the controller")
  selectAllUsers(req)
        .then(users => {
        res.status(200).send({ users });
      })
     
      .catch(err => {console.log(err)
       next(err)})
    }