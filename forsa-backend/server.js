require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const annoncesRouter = require('./routes/annonces');

const app = express();

// Configurer CORS pour accepter les requêtes du frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Middleware de logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Ajouter un préfixe /api à toutes les routes
app.use('/api/annonces', annoncesRouter);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/forsaplus';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Serveur backend en cours d'exécution sur le port ${PORT}`)
);