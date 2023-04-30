import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './Views/Dashboard/Dashboard';
import Login from './Views/Dashboard/Login/Login';
import Register from './Views/Dashboard/Register/Register';

function App() {

  useEffect(() => {
    console.log("APP LOADED")

  }, []);

  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
