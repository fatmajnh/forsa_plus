import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import DarkModeToggle from './DarkModeToggle';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">FORSA+</div>

      <ul className="nav-links">
        <li><Link to="/home">Accueil</Link></li>
        <li><Link to="/annonces">Annonces</Link></li>
        <li><Link to="/boutique">Boutique</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <DarkModeToggle />
        
      </ul>
    </nav>
  );
}
