const express = require("express");
const router = express.Router();


const auth = require('../middleware/auth');

const Sauce = require("../models/sauce");



router.get("/api/sauces/:id", (req, res, next) => {
    Sauce.findOne({ userId: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
});

router.get('/api/sauces', (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
    next();
});

module.exports = router