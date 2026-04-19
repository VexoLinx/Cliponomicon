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
          placeholder="Search title, game, or tags..." 
          className="search-input"
        />
      </div>
      
      <div className="filter-container">
        <select className="sort-select">
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
        </select>
      </div>
    </header>
  );
};

export default TopBar;