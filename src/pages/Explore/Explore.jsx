import React from 'react';
import SearchableAPIList from './SearchableAPIList';
import CategoryNav from './CategoryNav';
import './ExplorePage.css';

function Explore() {
  return (
    <div className="explore-page">
      <CategoryNav />
      <SearchableAPIList />
      
    </div>
  );
}

export default Explore;
