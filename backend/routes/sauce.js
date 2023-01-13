const express = require("express");
const sauceController = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const router = express.Router();


router.post("/", auth, multer, sauceController.createSauce);
router.post("/:id/like", auth, sauceController.addLikes);
router.put("/:id", auth, sauceController.modifySauce);
router.delete("/:id", auth, sauceController.deleteSauce);
router.get("/", auth, sauceController.getAllSauces );
router.get("/:id", auth, sauceController.getOnesauce);


module.exports = router