import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h1 style={{ color: '#2563eb' }}>📊 Accountant First</h1>
        <p>If you can see this, React and Nginx are routing perfectly!</p>
        
        <nav style={{ margin: '20px 0' }}>
          <Link to="/login" style={{ margin: '0 10px' }}>Login Page</Link> | 
          <Link to="/dashboard" style={{ margin: '0 10px' }}>Dashboard</Link>
        </nav>

        <hr style={{ maxWidth: '400px', margin: '20px auto', borderColor: '#e5e7eb' }} />

        <Routes>
          <Route path="/" element={<h2>🏡 Homepage View</h2>} />
          <Route path="/login" element={<h2>🔑 Login Form Component Placeholder</h2>} />
          <Route path="/dashboard" element={<h2>📈 Main Dashboard View Placeholder</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;