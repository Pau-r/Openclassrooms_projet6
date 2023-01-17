const Sauce = require("../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
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
};

exports.addLikes = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce => {
            let like = req.body.like;
            let userId = req.body.userId;

            if (like == 1) {
                if (!sauce.usersLiked.includes(userId)) {
                    sauce.usersLiked.push(userId);
                    sauce.likes++;
                }
            } else if (like == 0) {
                if (sauce.usersLiked.includes(userId)) {
                    let indexUserId = sauce.usersLiked.indexOf(userId);
                    sauce.usersLiked.splice(indexUserId, 1);
                    sauce.likes--;
                }
                if (sauce.usersDisliked.includes(userId)) {
                    let indexUserId = sauce.usersDisliked.indexOf(userId);
                    sauce.usersDisliked.splice(indexUserId, 1);
                    sauce.dislikes--;
                }
            } else {
                if (!sauce.usersDisliked.includes(userId)) {
                    sauce.usersDisliked.push(userId);
                    sauce.dislikes++;
                }
            }
            return Sauce.updateOne({ _id: req.params.id }, sauce);
        }))
        .then(() => {
            (res.status(200).json({ message: "OK" }));
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ error })
        });
};

exports.modifySauce = (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'La sauce a bien été modifiée !' }))
        .catch(error => res.status(500).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: "Non-autorisé" });
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'La sauce a été supprimée !' }))
                        .catch(error => res.status(400).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => {
            res.status(200).json(sauces)
        })
        .catch(error => res.status(400).json({ error }));
};

exports.getOnesauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};