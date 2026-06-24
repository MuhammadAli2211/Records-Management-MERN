import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        'https://records-management-backend.vercel.app/api/auth/register',
        {
          name,
          email,
          password,
          role,
        }
      );

      alert('Registration Successful! Please login.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration Failed');
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
      <h2>Register</h2>

      <form
        onSubmit={handleRegister}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: '10px' }}
        />

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

        <label>Role:</label>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: '10px' }}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          style={{
            padding: '10px',
            background: 'green',
            color: 'white',
            border: 'none',
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;