const express = require('express');
const router = express.Router();
const Annonce = require('../models/Annonce');

// GET /annonces -> liste toutes les annonces
router.get('/get', async (req, res) => {
  try {
    const annonces = await Annonce.find().sort({ createdAt: -1 });
    res.json(annonces);
  } catch (err) {
    console.error('Erreur GET:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /annonces -> ajouter une annonce
router.post('/create', async (req, res) => {
  try {
    const { titre, description, categorie, prix, localisation, image } = req.body;

    // Vérification des champs obligatoires
    if (!titre || !description || !categorie || !prix || !localisation) {
      return res.status(400).json({ error: 'Tous les champs requis doivent être remplis' });
    }

    const annonce = new Annonce({
      titre,
      description,
      categorie,
      prix: parseFloat(prix),
      localisation,
      image: image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500'
    });

    await annonce.save();
    res.status(201).json(annonce);

  } catch (err) {
    console.error('Erreur POST:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /annonces/:id -> supprimer une annonce
router.delete('/:id', async (req, res) => {
  try {
    const result = await Annonce.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Annonce non trouvée' });
    }
    res.json({ message: 'Annonce supprimée' });
  } catch (err) {
    console.error('Erreur DELETE:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /annonces/:id -> modifier une annonce
router.put('/:id', async (req, res) => {
  try {
    const { titre, description, categorie, prix, localisation, image } = req.body;

    const annonce = await Annonce.findByIdAndUpdate(
      req.params.id,
      { 
        titre, 
        description, 
        categorie, 
        prix: parseFloat(prix), 
        localisation, 
        image 
      },
      { new: true } // renvoie la version mise à jour
    );

    if (!annonce) return res.status(404).json({ error: 'Annonce non trouvée' });

    res.json(annonce);

  } catch (err) {
    console.error('Erreur PUT:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;