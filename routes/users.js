const express = require("express");
const router = express.Router();


const {
  getAllUsers,
} = require("../controllers/users");


router.get("/", getAllUsers);
// router.get("/:user_mail", getCollectionByUser);
// router.get("/id/:id_collection", getCollectionById);

// router.post("/", postCollection);
// router.patch("/:id_collection", patchCollection);
// router.delete("/:id_collection", deleteCollection);

module.exports = router;
