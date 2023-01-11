const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sauces = require("../models/sauce");

router.post("/", auth, multer, (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch(error => res.status(400).json({ error }));
    next();
});

router.put("/:id", auth, (req, res, next) => {
    sauces.updateOne({_id: req.params.id}, { ...req.body, _id: req.params.id})
    .then(() => res.status(200).json({ message: 'La sauce a bien été modifiée !'}))
    .catch(error => res.status(400).json({ error }));
});

router.delete("/:id", auth, (req, res, next) => {
    sauces.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'La sauce a été supprimée !'}))
      .catch(error => res.status(400).json({ error }));
  });

router.get("/", auth, (req, res, next) => {
    sauces.find() 
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
    next();
});

router.get("/:id", auth, (req, res, next) => {
    sauces.findOne({ userId: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
        next();
});


module.exports = router