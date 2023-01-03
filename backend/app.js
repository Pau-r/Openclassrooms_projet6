const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://pauliner:toipsL1sfW9GbZJf@cluster0.djeelzt.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !')
    );



app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
});

module.exports = app;