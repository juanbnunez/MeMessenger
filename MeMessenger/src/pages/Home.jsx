// src/components/Home.jsx
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Home = ({ setIsLoggedIn }) => {
  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
  };

  return (
    <div>
      <h1>Welcome to Home</h1>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Home;
