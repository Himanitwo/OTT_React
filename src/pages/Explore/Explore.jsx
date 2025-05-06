import React from 'react';
import SearchableAPIList from './SearchableAPIList';
import CategoryNav from './CategoryNav';
import './ExplorePage.css';

function Explore() {
  return (
    <div className="explore-page">
      <SearchableAPIList />
      <CategoryNav />
      
    </div>
  );
}

export default Explore;
