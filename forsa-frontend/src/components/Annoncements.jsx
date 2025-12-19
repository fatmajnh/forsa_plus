import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../axiosConfig';
import './Annoncements.css';

const Annoncements = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRandomAnnonces();
  }, []);

  const fetchRandomAnnonces = async () => {
    try {
      setLoading(true);
      const response = await api.get('/annonces/get');

      // Shuffle and take 5 random announcements
      const shuffled = response.data.sort(() => Math.random() - 0.5);
      const randomFive = shuffled.slice(0, 5);

      setAnnonces(randomFive);
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
      setAnnonces([]);
    } finally {
      setLoading(false);
    }
  };

  // Format price
  const formatPrice = (prix) => {
    return prix ? prix.toLocaleString('fr-TN') + ' DT' : 'Prix non défini';
  };

  // Calculate time elapsed
  const getTimeElapsed = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    return date.toLocaleDateString('fr-TN');
  };

  return (
    <div className="annoncements-container">
      {/* En-tête */}
      <div className="annoncements-header">
        <h1 className="annoncements-title">Annonces récentes</h1>
        <p className="annoncements-subtitle">Les meilleures offres du moment</p>
        <div className="separator"></div>
      </div>

      {/* Liste des annonces */}
      <div className="annoncements-list">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Chargement...</p>
        ) : annonces.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Aucune annonce disponible</p>
        ) : (
          annonces.map((annonce) => (
            <div key={annonce._id} className="annonce-card">
              {/* Ligne de séparation */}
              <div className="annonce-separator"></div>

              {/* Catégorie */}
              <div className="annonce-category">
                {annonce.categorie}
              </div>

              {/* Titre */}
              <h3 className="annonce-title">{annonce.titre}</h3>

              {/* Prix */}
              <div className="annonce-price">{formatPrice(annonce.prix)}</div>

              {/* Localisation */}
              <div className="annonce-location">{annonce.localisation}</div>

              {/* Temps */}
              <div className="annonce-time">{getTimeElapsed(annonce.createdAt)}</div>
            </div>
          ))
        )}
      </div>

      {/* Link to see all */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Link to="/boutique" style={{
          backgroundColor: '#1d3355',
          color: 'white',
          padding: '12px 30px',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: '600'
        }}>
          Voir toutes les annonces
        </Link>
      </div>
    </div>
  );
};

export default Annoncements;