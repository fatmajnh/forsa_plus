import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './Annonces.css';
import { Plus, Edit, Trash2, MapPin, Calendar, Tag, Check, X, Upload, Star, Eye } from 'lucide-react';
import api from '../axiosConfig';

const Annonces = () => {
  // États pour le formulaire
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: '',
    prix: '',
    localisation: '',
    image: ''
  });

  // États pour les annonces
  const [annonces, setAnnonces] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [previewImage, setPreviewImage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Catégories disponibles
  const categories = [
    'Électronique',
    'Mobilier',
    'Immobilier',
    'Véhicules',
    'Mode',
    'Sports',
    'Services',
    'Emploi',
    'Autre'
  ];

  // Villes de Tunisie pour la localisation
  const villesTunisie = [
    'Tunis',
    'Sousse',
    'Sfax',
    'Ariana',
    'Ben Arous',
    'Manouba',
    'Nabeul',
    'Bizerte',
    'Monastir',
    'Mahdia',
    'Kairouan',
    'Gabès',
    'Gafsa',
    'Tozeur',
    'Médenine',
    'Tataouine',
    'Autre'
  ];

  // Charger les annonces depuis l'API backend
  useEffect(() => {
    fetchAnnonces();
  }, []);

  // Fonction pour récupérer les annonces
  const fetchAnnonces = async () => {
    try {
      setLoading(true);
      const response = await api.get('/annonces/get');
      
      // Transformer les données MongoDB pour correspondre au format attendu
      const formattedAnnonces = response.data.map(annonce => ({
        id: annonce._id,
        titre: annonce.titre,
        description: annonce.description,
        categorie: annonce.categorie,
        prix: annonce.prix,
        localisation: annonce.localisation,
        image: annonce.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500',
        date: annonce.createdAt || new Date().toISOString(),
        note: 0,
        vues: Math.floor(Math.random() * 100),
        statut: 'active',
        updatedAt: annonce.updatedAt
      }));
      
      setAnnonces(formattedAnnonces);
      
      // Sauvegarder aussi dans localStorage comme backup
      localStorage.setItem('annonces', JSON.stringify(formattedAnnonces));
      
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
      
      // Fallback sur localStorage en cas d'erreur
      const savedAnnonces = localStorage.getItem('annonces');
      if (savedAnnonces) {
        setAnnonces(JSON.parse(savedAnnonces));
      }
      
      alert('Impossible de se connecter au serveur. Mode hors ligne activé.');
    } finally {
      setLoading(false);
    }
  };

  // Gestion des changements du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Gestion du téléchargement d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux (max 5MB)');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!formData.titre.trim()) errors.titre = 'Le titre est requis';
    if (formData.titre.length > 100) errors.titre = 'Le titre doit faire moins de 100 caractères';
    if (!formData.description.trim()) errors.description = 'La description est requise';
    if (formData.description.length > 1000) errors.description = 'La description doit faire moins de 1000 caractères';
    if (!formData.categorie) errors.categorie = 'La catégorie est requise';
    if (!formData.prix || parseFloat(formData.prix) <= 0) errors.prix = 'Prix valide requis';
    if (!formData.localisation) errors.localisation = 'La localisation est requise';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Ajouter ou modifier une annonce
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSaving(true);
      
      const annonceData = {
        titre: formData.titre,
        description: formData.description,
        categorie: formData.categorie,
        prix: parseFloat(formData.prix),
        localisation: formData.localisation,
        image: formData.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500'
      };

      if (editingId) {
        // MODIFICATION - Mettre à jour l'annonce existante dans MongoDB
        await api.put(`/annonces/${editingId}`, annonceData);
      } else {
        // AJOUT - Ajouter une nouvelle annonce dans MongoDB
        await api.post('/annonces/create', annonceData);
      }

      // Recharger les annonces depuis l'API
      await fetchAnnonces();
      
      // Réinitialiser le formulaire
      resetForm();
      
      // Afficher un message de succès
      alert(editingId ? 'Annonce modifiée avec succès!' : 'Annonce créée avec succès!');
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      // En cas d'erreur, sauvegarder localement
      const nouvelleAnnonce = {
        id: editingId || Date.now(),
        titre: formData.titre,
        description: formData.description,
        categorie: formData.categorie,
        prix: parseFloat(formData.prix),
        localisation: formData.localisation,
        image: formData.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500',
        date: new Date().toISOString(),
        note: 0,
        vues: 0,
        statut: 'active'
      };

      if (editingId) {
        setAnnonces(prevAnnonces => 
          prevAnnonces.map(annonce => 
            annonce.id === editingId ? nouvelleAnnonce : annonce
          )
        );
      } else {
        setAnnonces(prevAnnonces => [nouvelleAnnonce, ...prevAnnonces]);
      }
      
      alert('Annonce sauvegardée localement (erreur serveur)');
      
    } finally {
      setSaving(false);
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      categorie: '',
      prix: '',
      localisation: '',
      image: ''
    });
    setEditingId(null);
    setPreviewImage(null);
    setFormErrors({});
  };

  // Éditer une annonce
  const handleEdit = (annonce) => {
    setFormData({
      titre: annonce.titre,
      description: annonce.description,
      categorie: annonce.categorie,
      prix: annonce.prix.toString(),
      localisation: annonce.localisation,
      image: annonce.image
    });
    setEditingId(annonce.id);
    setPreviewImage(annonce.image);
    
    // Scroll vers le formulaire
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SUPPRIMER une annonce
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      return;
    }

    try {
      // Supprimer de MongoDB
      await api.delete(`/annonces/${id}`);
      
      // Mettre à jour l'état local
      setAnnonces(prevAnnonces => prevAnnonces.filter(annonce => annonce.id !== id));
      
      // Mettre à jour localStorage
      const updatedAnnonces = annonces.filter(annonce => annonce.id !== id);
      localStorage.setItem('annonces', JSON.stringify(updatedAnnonces));
      
      alert('Annonce supprimée avec succès!');
      
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      
      // Supprimer localement en cas d'erreur
      setAnnonces(prevAnnonces => prevAnnonces.filter(annonce => annonce.id !== id));
      
      const updatedAnnonces = annonces.filter(annonce => annonce.id !== id);
      localStorage.setItem('annonces', JSON.stringify(updatedAnnonces));
      
      alert('Annonce supprimée localement (erreur serveur)');
    }
  };

  // Formater le prix
  const formatterPrix = (prix) => {
    return prix.toLocaleString('fr-TN') + ' DT';
  };

  // Formater la date
  const formatterDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-TN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Calculer le temps écoulé
  const calculerTempsEcoule = (dateString) => {
    const date = new Date(dateString);
    const maintenant = new Date();
    const diffMs = maintenant - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return formatterDate(dateString);
    }
  };

  // Filtrer les annonces par catégorie
  const annoncesFiltrees = selectedCategory === 'Tous' 
    ? annonces 
    : annonces.filter(annonce => annonce.categorie === selectedCategory);

  return (
    <div className="annonces-page">
      {/* Navbar */}
      <Navbar />
      
      <div className="annonces-container">
        {/* En-tête */}
        <div className="annonces-header">
          <h1 className="annonces-title">📢 Publier une annonce</h1>
          <p className="annonces-subtitle">Partagez ce que vous avez à vendre ou à proposer avec la communauté</p>
          
          {loading && (
            <div className="loading-header">
              <div className="spinner-small"></div>
              <span>Chargement des annonces...</span>
            </div>
          )}
        </div>

        <div className="annonces-content">
          {/* Formulaire */}
          <div className="form-section">
            <div className="form-card">
              <div className="form-header">
                <h2>
                  <Plus size={24} />
                  {editingId ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
                </h2>
                {editingId && (
                  <button 
                    onClick={resetForm} 
                    className="cancel-btn"
                    type="button"
                  >
                    <X size={18} />
                    Annuler
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="annonce-form">
                {/* Titre */}
                <div className="form-group">
                  <label htmlFor="titre">Titre de l'annonce *</label>
                  <input
                    type="text"
                    id="titre"
                    name="titre"
                    value={formData.titre}
                    onChange={handleChange}
                    placeholder="Ex: iPhone 15 Pro Max en excellent état"
                    className={formErrors.titre ? 'error' : ''}
                    maxLength="100"
                  />
                  {formErrors.titre && <span className="error-message">{formErrors.titre}</span>}
                  <div className="char-count">{formData.titre.length}/100</div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label htmlFor="description">Description détaillée *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Décrivez votre produit ou service en détails..."
                    rows="4"
                    className={formErrors.description ? 'error' : ''}
                    maxLength="1000"
                  ></textarea>
                  {formErrors.description && <span className="error-message">{formErrors.description}</span>}
                  <div className="char-count">{formData.description.length}/1000</div>
                </div>

                <div className="form-row">
                  {/* Catégorie */}
                  <div className="form-group">
                    <label htmlFor="categorie">Catégorie *</label>
                    <select
                      id="categorie"
                      name="categorie"
                      value={formData.categorie}
                      onChange={handleChange}
                      className={formErrors.categorie ? 'error' : ''}
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {formErrors.categorie && <span className="error-message">{formErrors.categorie}</span>}
                  </div>

                  {/* Prix */}
                  <div className="form-group">
                    <label htmlFor="prix">Prix (DT) *</label>
                    <input
                      type="number"
                      id="prix"
                      name="prix"
                      value={formData.prix}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className={formErrors.prix ? 'error' : ''}
                    />
                    {formErrors.prix && <span className="error-message">{formErrors.prix}</span>}
                  </div>
                </div>

                {/* Localisation */}
                <div className="form-group">
                  <label htmlFor="localisation">Localisation *</label>
                  <select
                    id="localisation"
                    name="localisation"
                    value={formData.localisation}
                    onChange={handleChange}
                    className={formErrors.localisation ? 'error' : ''}
                  >
                    <option value="">Sélectionnez une ville</option>
                    {villesTunisie.map((ville, index) => (
                      <option key={index} value={ville}>{ville}</option>
                    ))}
                  </select>
                  {formErrors.localisation && <span className="error-message">{formErrors.localisation}</span>}
                </div>

                {/* Image */}
                <div className="form-group">
                  <label htmlFor="image">Photo du produit</label>
                  <div className="image-upload">
                    <label htmlFor="image-input" className="upload-btn">
                      <Upload size={20} />
                      {previewImage ? 'Changer la photo' : 'Télécharger une photo'}
                    </label>
                    <input
                      type="file"
                      id="image-input"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    
                    {previewImage && (
                      <div className="image-preview">
                        <img src={previewImage} alt="Aperçu" />
                        <button 
                          type="button" 
                          onClick={() => {
                            setPreviewImage(null);
                            setFormData(prev => ({ ...prev, image: '' }));
                          }}
                          className="remove-image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="help-text">Taille max: 5MB. Formats: JPG, PNG, GIF</p>
                </div>

                {/* Boutons d'action */}
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div className="spinner-btn"></div>
                        {editingId ? 'Modification...' : 'Publication...'}
                      </>
                    ) : editingId ? (
                      <>
                        <Check size={18} />
                        Mettre à jour l'annonce
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        Publier l'annonce
                      </>
                    )}
                  </button>
                  
                  {editingId && !saving && (
                    <button 
                      type="button"
                      onClick={resetForm}
                      className="secondary-btn"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Filtres et liste */}
          <div className="annonces-list-section">
            {/* Filtres */}
            <div className="filters-section">
              <div className="stats-card">
                <h3>Vos annonces</h3>
                <div className="stats">
                  <div className="stat-item">
                    <span className="stat-value">{annonces.length}</span>
                    <span className="stat-label">Total</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">
                      {annonces.filter(a => a.statut === 'active').length}
                    </span>
                    <span className="stat-label">Actives</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">
                      {annonces.reduce((sum, annonce) => sum + annonce.vues, 0)}
                    </span>
                    <span className="stat-label">Vues totales</span>
                  </div>
                </div>
              </div>

              <div className="category-filters">
                <h4>Filtrer par catégorie</h4>
                <div className="category-buttons">
                  <button 
                    className={`category-btn ${selectedCategory === 'Tous' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('Tous')}
                    type="button"
                  >
                    Tous ({annonces.length})
                  </button>
                  {categories.map((cat, index) => {
                    const count = annonces.filter(a => a.categorie === cat).length;
                    return count > 0 && (
                      <button
                        key={index}
                        className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                        type="button"
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Liste des annonces */}
            <div className="annonces-list-container">
              <h3>
                {selectedCategory === 'Tous' 
                  ? 'Toutes vos annonces' 
                  : `Annonces ${selectedCategory.toLowerCase()}`
                } ({annoncesFiltrees.length})
              </h3>

              {loading ? (
                <div className="loading-annonces">
                  <div className="spinner"></div>
                  <p>Chargement de vos annonces...</p>
                </div>
              ) : annoncesFiltrees.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h4>Aucune annonce trouvée</h4>
                  <p>
                    {selectedCategory === 'Tous' 
                      ? "Vous n'avez pas encore publié d'annonce. Commencez par en créer une !"
                      : `Vous n'avez pas d'annonces dans la catégorie "${selectedCategory}"`
                    }
                  </p>
                  {selectedCategory !== 'Tous' && (
                    <button 
                      onClick={() => setSelectedCategory('Tous')}
                      className="view-all-btn"
                      type="button"
                    >
                      Voir toutes les annonces
                    </button>
                  )}
                </div>
              ) : (
                <div className="annonces-grid">
                  {annoncesFiltrees.map(annonce => (
                    <div key={annonce.id} className="annonce-card">
                      {/* Image */}
                      <div className="annonce-image">
                        <img src={annonce.image} alt={annonce.titre} />
                        <div className="annonce-badge">
                          {annonce.statut === 'active' ? 'Active' : 'Inactive'}
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="annonce-content">
                        <div className="annonce-header">
                          <h4>{annonce.titre}</h4>
                          <div className="annonce-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <button
                              onClick={() => handleEdit(annonce)}
                              className="action-btn edit"
                              title="Modifier"
                              type="button"
                              style={{
                                backgroundColor: "#1d3355",
                                color: "white",
                                border: "none",
                                fontWeight: "600",
                                padding: "8px 16px",
                                borderRadius: "5px",
                                cursor: "pointer"
                              }}
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDelete(annonce.id)}
                              className="action-btn delete"
                              title="Supprimer"
                              type="button"
                              style={{
                                backgroundColor: "transparent",
                                color: "#dc3545",
                                border: "2px solid #dc3545",
                                fontWeight: "600",
                                padding: "8px 16px",
                                borderRadius: "5px",
                                cursor: "pointer"
                              }}
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>

                        <div className="annonce-category">
                          <Tag size={14} />
                          <span>{annonce.categorie}</span>
                        </div>

                        <p className="annonce-description">
                          {annonce.description.length > 100
                            ? `${annonce.description.substring(0, 100)}...`
                            : annonce.description
                          }
                        </p>

                        <div className="annonce-details">
                          <div className="detail-item">
                            <MapPin size={14} />
                            <span>{annonce.localisation}</span>
                          </div>
                          <div className="detail-item">
                            <Calendar size={14} />
                            <span>{calculerTempsEcoule(annonce.date)}</span>
                          </div>
                        </div>

                        <div className="annonce-footer">
                          <div className="annonce-price">
                            {formatterPrix(annonce.prix)}
                          </div>
                          <div className="annonce-stats">
                            <div className="stat">
                              <Eye size={14} />
                              <span>{annonce.vues} vues</span>
                            </div>
                            <div className="stat">
                              <Star size={14} />
                              <span>{annonce.note}/5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conseils */}
        <div className="tips-section">
          <h3>💡 Conseils pour une bonne annonce</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <h4>Photo de qualité</h4>
              <p>Utilisez des photos claires et bien éclairées sous différents angles.</p>
            </div>
            <div className="tip-card">
              <h4>Description détaillée</h4>
              <p>Incluez toutes les informations importantes sur l'état et les caractéristiques.</p>
            </div>
            <div className="tip-card">
              <h4>Prix juste</h4>
              <p>Fixez un prix raisonnable en comparant avec le marché.</p>
            </div>
            <div className="tip-card">
              <h4>Réponse rapide</h4>
              <p>Répondez rapidement aux messages pour augmenter vos chances de vente.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Annonces;