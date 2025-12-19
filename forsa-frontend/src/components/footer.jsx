import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Mail, Phone, MapPin} from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <Container>
        {/* Section principale */}
        <Row className="footer-main">
          {/* Logo et description */}
          <Col className="footer-brand">
            <div className="brand-logo">
              <div className="logo-square">FORSA+</div>
            </div>
            <p className="brand-description">
              Votre plateforme de confiance pour publier et découvrir des annonces
            </p>
          </Col>

          {/* Navigation */}
          <Col className="footer-nav">
            <h5 className="footer-nav-title">Navigation</h5>
            <ul className="footer-nav-list">
              <li><a href="/" className="footer-nav-link">Accueil</a></li>
              <li><a href="/contact" className="footer-nav-link">Contact</a></li>
              <li><a href="/boutique" className="footer-nav-link">Boutique</a></li>
            </ul>
          </Col>
          {/* Contact */}
          <Col className="footer-contact">
            <h5 className="footer-contact-title">Contact</h5>
            <ul className="footer-contact-list">
              <li className="contact-item">
                <Mail size={16} className="contact-icon" />
                <span className="contact-text">forsa.plus@gmail.com</span>
              </li>
              <li className="contact-item">
                <Phone size={16} className="contact-icon" />
                <span className="contact-text">+216 25 789 143</span>
              </li>
              <li className="contact-item">
                <MapPin size={16} className="contact-icon" />
                <span className="contact-text">ESSTHS - Hammem Sousse</span>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Bas du footer */}
        <Row className="footer-bottom">
          <Col className="copyright">
            &copy; 2025 FORSA+ . Tous droits réservés.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}