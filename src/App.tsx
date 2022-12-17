import React, { useEffect } from 'react';
import './App.css';
import Dashboard from './Views/Dashboard/Dashboard';

function App() {

  useEffect(() => {
    console.log("APP LOADED")

  }, []);

  return (
    <div className="App">
      <Dashboard></Dashboard>
    </div>
  );
}

export default App;
