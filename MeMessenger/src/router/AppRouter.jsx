// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login"
import Home from "../pages/Home";
import Register from "../pages/Register";
import { AuthProvider, useAuth } from "../context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta protegida: solo accesible si el usuario está autenticado */}
          <Route
            path="/"
            element={<ProtectedRoute><Home /></ProtectedRoute>}
          />
          {/* Ruta de login */}
          <Route path="/login" element={<Login />} />
          {/* Ruta de registro */}
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Si el usuario no está autenticado, redirige al login
    return <Navigate to="/login" />;
  }

  // Si el usuario está autenticado, muestra el componente hijo (Home)
  return children;
};

export default App;
