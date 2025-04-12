const express = require("express");
const router = express.Router();


const {
  getAllUsers, getUserById, postUser
} = require("../controllers/users");


router.get("/", getAllUsers);
router.get("/:user_id", getUserById);
router.post("/register", postUser);
// router.get("/:user_mail", getCollectionByUser);
// router.get("/id/:id_collection", getCollectionById);

// router.post("/", postCollection);
// router.patch("/:id_collection", patchCollection);
// router.delete("/:id_collection", deleteCollection);

module.exports = router;
