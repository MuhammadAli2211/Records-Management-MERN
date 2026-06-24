import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'https://records-management-backend.vercel.app/api/auth/login',
        {
          email,
          password,
        }
      );

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Login Failed');
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: 'auto',
        marginTop: '50px',
      }}
    >
      <h2>Login</h2>

      <form
        onSubmit={handleLogin}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px' }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px' }}
        />

        <button
          type="submit"
          style={{
            padding: '10px',
            background: 'blue',
            color: 'white',
            border: 'none',
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;