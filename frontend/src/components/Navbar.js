import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/#/');
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px',
        background: '#333',
        color: '#fff'
      }}
    >
      <h2>Auth System</h2>

      <div>
        {token ? (
          <>
            <span style={{ marginRight: '15px' }}>
              Welcome, {user?.name} ({user?.role})
            </span>

            <button
              onClick={logout}
              style={{
                background: 'red',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" style={{ color: 'white', marginRight: '15px' }}>
              Login
            </Link>

            <Link to="/register" style={{ color: 'white' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;