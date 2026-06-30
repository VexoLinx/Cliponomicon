import { BsSearch } from "react-icons/bs";
import React from 'react';
import './TopBar.css';

const TopBar = () => {
  return (
    <header className="topbar">
      <div className="search-container">
        <span className="search-icon"><BsSearch /></span>
        <input 
          type="text" 
          placeholder="@Username, Game, etc..." 
          className="search-input"
        />
      </div>
      
      <div className="filter-container">
        <select className="sort-select">
          <option value="newest">Nuevos</option>
          <option value="popular">Más visto</option>
        </select>
      </div>
    </header>
  );
};

export default TopBar;