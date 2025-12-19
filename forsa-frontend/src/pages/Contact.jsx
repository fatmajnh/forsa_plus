import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './Contact.css';
import { Mail, Phone, MapPin,Clock } from 'lucide-react';

export default function Contact() {
  return (
    <div className="contact-page">
      {/* Navbar */}
      <Navbar />
      
      <div className="contact-container">
        {/* En-tête */}
        <div className="contact-header">
          <h1 className="contact-title">📞 Contactez-nous</h1>
          <p className="contact-subtitle">Nous sommes là pour vous aider. N'hésitez pas à nous contacter !</p>
        </div>

        <div className="contact-content">
          {/* Informations de contact */}
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">
                <Mail size={24} />
              </div>
              <h3>Email</h3>
              <p>contact@forsaplus.tn</p>
              <p>forsaplus@gmail.com</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Phone size={24} />
              </div>
              <h3>Téléphone</h3>
              <p>+216 70 123 456</p>
              <p>+216 25 987 654</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <MapPin size={24} />
              </div>
              <h3>Adresse</h3>
              <p>École supérieure des sciences et de la technologie de Hammam Sousse</p>
              <p>Sousse, Tunisie</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Clock size={24} />
              </div>
              <h3>Horaires</h3>
              <p>Lun - Ven: 9h - 18h</p>
              <p>Samedi: 10h - 16h</p>
            </div>
          </div>
          </div>
          </div>
          </div>

         
  );
};

