// models/Annonce.js
const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  categorie: { type: String, required: true },
  prix: { type: Number, required: true },
  localisation: { type: String, required: true },
  image: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model('Annonce', annonceSchema);