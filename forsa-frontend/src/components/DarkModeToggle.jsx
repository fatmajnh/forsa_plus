import React from "react";
import "../DarkMode.css";

export default function DarkModeToggle() {
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark-mode");
  };

  return (
    <button className="dark-btn" onClick={toggleTheme}>
      🌙 
    </button>
  );
}