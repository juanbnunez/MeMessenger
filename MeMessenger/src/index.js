import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa la librería de React
import {AuthContext} from './context/AuthContext'; // Importa el contexto de autenticación
import {ChatApp} from './chatApp'; // Importa el componente principal de la aplicación
import { BrowserRouter } from 'react-router-dom';

// Este es el punto de entrada principal donde la aplicación se renderiza
ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthContext>
        <React.StrictMode>
            <BrowserRouter>
            <ChatApp />  {/* Componente principal de la aplicación */}
            </BrowserRouter>
        </React.StrictMode>,
      
    </AuthContext>
  
);
