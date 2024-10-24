//import React from 'react';
import Navbar from './Navbar';
import Search from './Search';
import ItemChat from './ItemChat';
import './styles.css'
const Sidebar = () => {
  return (
    <div className="sidebar">
      <Navbar />
      <Search />
      <ItemChat/>
    </div>
  );
};

export default Sidebar;
