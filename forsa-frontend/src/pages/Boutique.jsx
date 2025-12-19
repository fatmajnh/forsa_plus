import React, { useState, useEffect } from 'react';
import './Boutique.css';
import { Filter, ShoppingCart, Star, X, Trash2, Check, MapPin } from 'lucide-react';
import Navbar from "../components/Navbar";
import api from '../axiosConfig';

const Boutique = () => {
  // État pour les filtres
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('popularité');
  const [panier, setPanier] = useState([]);
  const [showPanier, setShowPanier] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // État pour les annonces de la base de données
  const [annoncesFromDB, setAnnoncesFromDB] = useState([]);
  const [loading, setLoading] = useState(false);

  // Données des produits statiques
  const produitsStatiques = [
    {
      id: 1,
      nom: "iPhone 15 Pro Max",
      categorie: "Électronique",
      prix: 1299,
      prixReduit: 1199,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=500",
      note: 4.8,
      avis: 124,
      promo: "-8%",
      nouveau: true,
      localisation: "Tunis, Tunisie"
    },
    {
      id: 2,
      nom: "MacBook Pro 16\" M3",
      categorie: "Électronique",
      prix: 2499,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500",
      note: 4.9,
      avis: 89,
      meilleurVente: true,
      localisation: "Sousse, Tunisie"
    },
    {
      id: 3,
      nom: "Canapé en cuir rouge",
      categorie: "Mobilier",
      prix: 899,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500",
      note: 4.5,
      avis: 56,
      localisation: "Ariana, Tunisie"
    },
    {
      id: 4,
      nom: "Vélo de montagne Trek",
      categorie: "Sports",
      prix: 749,
      prixReduit: 699,
      image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=500",
      note: 4.6,
      avis: 42,
      promo: "-7%",
      localisation: "Hammamet, Tunisie"
    },
    {
      id: 5,
      nom: "Montre Connectée",
      categorie: "Électronique",
      prix: 299,
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=500",
      note: 4.3,
      avis: 203,
      nouveau: true,
      localisation: "Monastir, Tunisie"
    },
    {
      id: 6,
      nom: "Appareil Photo Canon",
      categorie: "Électronique",
      prix: 1499,
      prixReduit: 1299,
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=500",
      note: 4.7,
      avis: 78,
      promo: "-13%",
      meilleurVente: true,
      localisation: "Bizerte, Tunisie"
    },
    {
      id: 7,
      nom: "Bureau en bois",
      categorie: "Mobilier",
      prix: 450,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500",
      note: 4.4,
      avis: 34,
      localisation: "Ben Arous, Tunisie"
    },
    {
      id: 8,
      nom: "Raquette de tennis",
      categorie: "Sports",
      prix: 129,
      image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=500",
      note: 4.2,
      avis: 67,
      localisation: "Nabeul, Tunisie"
    },
    {
      id: 9,
      nom: "Télévision OLED 55\"",
      categorie: "Électronique",
      prix: 1899,
      prixReduit: 1699,
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=500",
      note: 4.7,
      avis: 92,
      promo: "-11%",
      localisation: "Sfax, Tunisie"
    },
    {
      id: 10,
      nom: "Table à manger 6 places",
      categorie: "Mobilier",
      prix: 650,
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=500",
      note: 4.3,
      avis: 45,
      localisation: "Gabès, Tunisie"
    },
    {
      id: 11,
      nom: "Tapis de yoga",
      categorie: "Sports",
      prix: 89,
      image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=500",
      note: 4.1,
      avis: 78,
      localisation: "Kairouan, Tunisie"
    },
    {
      id: 12,
      nom: "PlayStation 5",
      categorie: "Électronique",
      prix: 1399,
      prixReduit: 1299,
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=500",
      note: 4.9,
      avis: 156,
      promo: "-7%",
      nouveau: true,
      localisation: "Gafsa, Tunisie"
    }
  ];

  // Charger les annonces depuis la base de données
  useEffect(() => {
    fetchAnnoncesFromDB();
  }, []);

 const fetchAnnoncesFromDB = async () => {
  try {
    setLoading(true);
    console.log('🔍 Chargement des annonces depuis DB...');
    
    const response = await api.get('/annonces/get');
    
    // Debug: afficher la structure des données
    if (response.data && response.data.length > 0) {
      console.log('📋 Champs disponibles dans la DB:', Object.keys(response.data[0]));
    }
    
    // Transformer les annonces en format produit
    const produitsFromAnnonces = response.data.map((annonce, index) => {
      // Gérer le nom (title ou titre)
      const nom = annonce.title || annonce.titre || `Annonce ${index + 1}`;
      
      // Générer des valeurs par défaut pour avis et note
      // car elles n'existent pas dans la base de données
      const avis = Math.floor(Math.random() * 50) + 10; // 10 à 59 avis
      const note = 4.0 + Math.random() * 1.0; // Note entre 4.0 et 5.0
      
      return {
        id: `db_${annonce._id || Date.now() + index}`,
        nom: nom,
        categorie: annonce.categorie || 'Autre',
        prix: annonce.prix || 0,
        image: annonce.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500',
        note: note, // Généré aléatoirement
        avis: avis, // Généré aléatoirement
        localisation: annonce.localisation || 'Tunisie',
        description: annonce.description || `${nom} - Pas de description détaillée`,
        isFromDB: true,
        // Champs supplémentaires pour l'affichage
        datePublication: annonce.createdAt ? new Date(annonce.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'
      };
    });
    
    console.log(`✅ ${produitsFromAnnonces.length} annonces chargées depuis DB`);
    
    setAnnoncesFromDB(produitsFromAnnonces);
    
  } catch (error) {
    console.error('❌ Erreur lors du chargement des annonces:', error);
    if (error.response) {
      console.error('📊 Réponse erreur:', error.response.status, error.response.data);
    }
    setNotification({
      message: `Impossible de charger les annonces: ${error.message}`,
      type: 'info'
    });
  } finally {
    setLoading(false);
  }
};

  // Combiner les produits statiques avec les annonces de la base de données
  const allProduits = [...produitsStatiques, ...annoncesFromDB];

  // Catégories avec comptes mis à jour
  const categories = [
    { id: 'tous', nom: 'Tous', count: allProduits.length },
    { id: 'electronique', nom: 'Électronique', count: allProduits.filter(p => p.categorie === 'Électronique').length },
    { id: 'mobilier', nom: 'Mobilier', count: allProduits.filter(p => p.categorie === 'Mobilier').length },
    { id: 'sports', nom: 'Sports', count: allProduits.filter(p => p.categorie === 'Sports').length },
    { id: 'immobilier', nom: 'Immobilier', count: allProduits.filter(p => p.categorie === 'Immobilier').length },
    { id: 'vehicules', nom: 'Véhicules', count: allProduits.filter(p => p.categorie === 'Véhicules').length },
    { id: 'mode', nom: 'Mode', count: allProduits.filter(p => p.categorie === 'Mode').length },
    { id: 'services', nom: 'Services', count: allProduits.filter(p => p.categorie === 'Services').length },
    { id: 'emploi', nom: 'Emploi', count: allProduits.filter(p => p.categorie === 'Emploi').length },
    { id: 'autre', nom: 'Autre', count: allProduits.filter(p => p.categorie === 'Autre').length }
  ];

  // Filtrer les produits
  const produitsFiltres = allProduits
    .filter(produit => {
      if (selectedCategory === 'Tous') return true;
      return produit.categorie === selectedCategory;
    })
    .filter(produit => produit.prix >= priceRange[0] && produit.prix <= priceRange[1])
    .sort((a, b) => {
      if (sortBy === 'prix-croissant') return a.prix - b.prix;
      if (sortBy === 'prix-decroissant') return b.prix - a.prix;
      if (sortBy === 'note') return b.note - a.note;
      return b.avis - a.avis;
    });

  // Fonction pour ajouter au panier
  const ajouterAuPanier = (produit) => {
    const produitExistant = panier.find(item => item.id === produit.id);
    
    if (produitExistant) {
      setPanier(panier.map(item =>
        item.id === produit.id
          ? { ...item, quantite: item.quantite + 1 }
          : item
      ));
    } else {
      setPanier([...panier, { ...produit, quantite: 1 }]);
    }
    
    // Afficher la notification
    setNotification({
      message: `${produit.nom} ajouté au panier`,
      type: 'success'
    });
    
    // Cacher la notification après 3 secondes
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Fonction pour retirer du panier
  const retirerDuPanier = (id) => {
    setPanier(panier.filter(item => item.id !== id));
    
    setNotification({
      message: "Produit retiré du panier",
      type: 'info'
    });
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Fonction pour modifier la quantité
  const modifierQuantite = (id, nouvelleQuantite) => {
    if (nouvelleQuantite < 1) {
      retirerDuPanier(id);
      return;
    }
    
    setPanier(panier.map(item =>
      item.id === id
        ? { ...item, quantite: nouvelleQuantite }
        : item
    ));
  };

  // Calculer le total du panier
  const calculerTotal = () => {
    return panier.reduce((total, item) => {
      const prix = item.prixReduit || item.prix;
      return total + (prix * item.quantite);
    }, 0);
  };

  // Formater le prix en dinars tunisiens
  const formatterPrix = (prix) => {
    return prix.toLocaleString('fr-TN') + ' DT';
  };

  // Formater la fourchette de prix dans les filtres
  const formatterRangePrix = (prix) => {
    return prix.toLocaleString('fr-TN') + ' DT';
  };

  return (
    <div className="boutique-page">
      {/* Navbar */}
      <Navbar />
      
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            {notification.type === 'success' ? (
              <Check size={20} className="notification-icon" />
            ) : (
              <span className="notification-icon">ℹ️</span>
            )}
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="notification-close">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      
      {/* Panier latéral */}
      <div className={`panier-sidebar ${showPanier ? 'open' : ''}`}>
        <div className="panier-header">
          <h3>
            <ShoppingCart size={20} />
            Votre Panier ({panier.length})
          </h3>
          <button onClick={() => setShowPanier(false)} className="close-panier">
            <X size={24} />
          </button>
        </div>
        
        {panier.length === 0 ? (
          <div className="panier-vide">
            <ShoppingCart size={48} className="panier-vide-icon" />
            <p>Votre panier est vide</p>
            <button onClick={() => setShowPanier(false)} className="btn-continuer">
              Continuer les achats
            </button>
          </div>
        ) : (
          <>
            <div className="panier-items">
              {panier.map(item => (
                <div key={item.id} className="panier-item">
                  <img src={item.image} alt={item.nom} className="panier-item-image" />
                  <div className="panier-item-details">
                    <h4>{item.nom}</h4>
                    <p className="panier-item-price">
                      {formatterPrix(item.prixReduit || item.prix)}
                    </p>
                    <div className="panier-item-quantite">
                      <button 
                        onClick={() => modifierQuantite(item.id, item.quantite - 1)}
                        className="quantite-btn"
                      >
                        -
                      </button>
                      <span>{item.quantite}</span>
                      <button 
                        onClick={() => modifierQuantite(item.id, item.quantite + 1)}
                        className="quantite-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => retirerDuPanier(item.id)}
                    className="remove-item"
                    title="Retirer du panier"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="panier-footer">
              <div className="panier-total">
                <span>Total:</span>
                <span className="total-prix">{formatterPrix(calculerTotal())}</span>
              </div>
              <button className="btn-commander">
                Commander maintenant
              </button>
              <button 
                onClick={() => setShowPanier(false)}
                className="btn-continuer"
              >
                Continuer les achats
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Overlay pour le panier */}
      {showPanier && (
        <div className="panier-overlay" onClick={() => setShowPanier(false)}></div>
      )}
      
      {/* Contenu de la boutique */}
      <div className="boutique-container">
        {/* En-tête de la boutique */}
        <div className="boutique-header">
          <h1 className="boutique-title">🛍 Notre Boutique</h1>
          <p className="boutique-subtitle">Découvrez nos meilleurs produits aux prix imbattables en Tunisie</p>
          
          <div className="boutique-info">
            {loading ? (
              <div className="loading-info">
                <span>Chargement des annonces...</span>
              </div>
            ) : (
              <div className="stats-banner">
                <span className="stat-item">
                  <strong>{allProduits.length}</strong> produits disponibles
                </span>
                <span className="stat-item">
                  <strong>{annoncesFromDB.length}</strong> annonces de particuliers
                </span>
                <span className="stat-item">
                  <strong>{produitsStatiques.length}</strong> produits premium
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="boutique-content">
          {/* Sidebar - Filtres */}
          <div className="filters-sidebar">
            <div className="filters-header">
              <Filter size={20} />
              <h3>Filtres</h3>
            </div>

            {/* Catégories */}
            <div className="filter-section">
              <h4 className="filter-title">Catégories</h4>
              <div className="categories-list">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`category-btn ${selectedCategory === cat.nom ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.nom)}
                  >
                    <span className="category-name">{cat.nom}</span>
                    <span className="category-count">({cat.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prix */}
            <div className="filter-section">
              <h4 className="filter-title">Fourchette de prix</h4>
              <div className="price-range">
                <div className="price-values">
                  <span>0 DT</span>
                  <span>5000 DT</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="range-slider"
                />
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="range-slider"
                />
                <div className="selected-range">
                  De {formatterRangePrix(priceRange[0])} à {formatterRangePrix(priceRange[1])}
                </div>
              </div>
            </div>

            {/* Trier par */}
            <div className="filter-section">
              <h4 className="filter-title">Trier par</h4>
              <div className="sort-options">
                {['popularité', 'prix-croissant', 'prix-decroissant', 'note'].map(option => (
                  <button
                    key={option}
                    className={`sort-btn ${sortBy === option ? 'active' : ''}`}
                    onClick={() => setSortBy(option)}
                  >
                    {option === 'popularité' && 'Popularité'}
                    {option === 'prix-croissant' && 'Prix croissant'}
                    {option === 'prix-decroissant' && 'Prix décroissant'}
                    {option === 'note' && 'Meilleures notes'}
                  </button>
                ))}
              </div>
            </div>

            {/* Indicateur annonces de la DB */}
            {annoncesFromDB.length > 0 && (
              <div className="db-indicator">
                <div className="db-badge">
                  <span className="db-dot"></span>
                  <span>{annoncesFromDB.length} annonces de particuliers disponibles</span>
                </div>
              </div>
            )}
          </div>

          {/* Grille des produits */}
          <div className="products-grid">
            {/* En-tête de la grille */}
            <div className="products-header">
              <div className="products-count">
                {produitsFiltres.length} produit{produitsFiltres.length > 1 ? 's' : ''} trouvé{produitsFiltres.length > 1 ? 's' : ''}
                {annoncesFromDB.length > 0 && (
                  <span className="db-count"> (dont {annoncesFromDB.length} annonces)</span>
                )}
              </div>
              <div className="active-filters">
                {selectedCategory !== 'Tous' && (
                  <span className="active-filter">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('Tous')}>×</button>
                  </span>
                )}
                {/* Bouton pour voir le panier */}
                <button 
                  className="btn-voir-panier"
                  onClick={() => setShowPanier(true)}
                  data-count={panier.length}
                >
                  <ShoppingCart size={18} />
                  Panier ({panier.length})
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-products">
                <div className="spinner"></div>
                <p>Chargement des produits...</p>
              </div>
            ) : (
              /* Les produits */
              <div className="products-list">
                {produitsFiltres.map(produit => (
                  <div key={produit.id} className={`product-card ${produit.isFromDB ? 'from-db' : ''}`}>
                    {/* Badges */}
                    <div className="product-badges">
                      {produit.promo && (
                        <span className="badge promo">{produit.promo}</span>
                      )}
                      {produit.nouveau && (
                        <span className="badge nouveau">Nouveau</span>
                      )}
                      {produit.meilleurVente && (
                        <span className="badge bestseller">Best-seller</span>
                      )}
                      {produit.isFromDB && (
                        <span className="badge db-badge">Annonce</span>
                      )}
                    </div>

                    {/* Image */}
                    <div className="product-image">
                      <img src={produit.image} alt={produit.nom} />
                      <button 
                        className="cart-btn-overlay"
                        onClick={() => ajouterAuPanier(produit)}
                        title="Ajouter au panier"
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>

                    {/* Contenu */}
                    <div className="product-content">
                      <span className="product-category">{produit.categorie}</span>
                      <h3 className="product-name">{produit.nom}</h3>
                      
                      {/* Note */}
                      <div className="product-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < Math.floor(produit.note) ? 'filled' : 'empty'}
                              fill={i < Math.floor(produit.note) ? "#ffc107" : "none"}
                            />
                          ))}
                        </div>
                        <span className="rating-text">
                          {produit.note.toFixed(1)} ({produit.avis} avis)
                        </span>
                      </div>

                      {/* Localisation */}
                      <div className="product-location">
                        <MapPin size={14} />
                        <span>{produit.localisation}</span>
                      </div>

                      {/* Prix */}
                      <div className="product-prices">
                        {produit.prixReduit ? (
                          <>
                            <span className="price discounted">{formatterPrix(produit.prix)}</span>
                            <span className="price current">{formatterPrix(produit.prixReduit)}</span>
                          </>
                        ) : (
                          <span className="price">{formatterPrix(produit.prix)}</span>
                        )}
                      </div>

                      {/* Description pour les annonces DB */}
                      {produit.isFromDB && produit.description && (
                        <div className="product-description">
                          <p>{produit.description.substring(0, 80)}...</p>
                        </div>
                      )}

                      {/* Boutons d'action */}
                      <div className="product-actions">
                        <button 
                          className="add-to-cart-btn"
                          onClick={() => ajouterAuPanier(produit)}
                        >
                          <ShoppingCart size={18} />
                          Ajouter au panier
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && produitsFiltres.length === 0 && (
              <div className="no-products">
                <ShoppingCart size={64} className="no-products-icon" />
                <h3>Aucun produit trouvé</h3>
                <p>Aucun produit ne correspond à vos critères de recherche.</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('Tous');
                    setPriceRange([0, 5000]);
                  }}
                  className="btn-reset-filters"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boutique;