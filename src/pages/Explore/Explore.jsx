// import './ExplorePage.css';
import React from 'react';
import SearchableAPIList from './SearchableAPIList'; // Ensure this path is correct


function Explore() {
  return (
    <div className="explore-page">
      <h1 style={{ textAlign: 'center' }}>User Search</h1>
      <SearchableAPIList />
    </div>
  );
}

export default Explore;
