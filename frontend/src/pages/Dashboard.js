import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from "react-router-dom";

function Dashboard() {
  const [records, setRecords] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  const API_URL = "https://records-management-backend.vercel.app";

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/records`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRecords();
    }
  }, []);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(
          `${API_URL}/api/records/${editId}`,
          {
            title,
            description
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setEditId(null);
      } else {
        await axios.post(
          `${API_URL}/api/records`,
          {
            title,
            description
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }

      setTitle('');
      setDescription('');
      fetchRecords();
    } catch (err) {
      alert(err.response?.data?.msg || 'Error saving record');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      try {
        await axios.delete(
          `${API_URL}/api/records/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        fetchRecords();
      } catch (err) {
        alert(err.response?.data?.msg || 'Error deleting');
      }
    }
  };

  const startEdit = (record) => {
    setEditId(record._id);
    setTitle(record.title);
    setDescription(record.description);
  };

  return (
    <div>
      <h1>
        {user?.role === 'admin'
          ? 'Admin Dashboard'
          : 'User Dashboard'}
      </h1>

      {(user?.role === 'user' ||
        (user?.role === 'admin' && editId)) && (
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: '20px',
            display: 'flex',
            gap: '10px'
          }}
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <button
            type="submit"
            style={{
              background: 'orange',
              padding: '5px'
            }}
          >
            {editId
              ? 'Update Record (Admin Only)'
              : 'Add Record'}
          </button>
        </form>
      )}

      <h3>Records Table</h3>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left'
        }}
      >
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>Title</th>
            <th>Description</th>

            {user?.role === 'admin' && <th>Created By</th>}
            {user?.role === 'admin' && <th>Created At</th>}

            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {records.map((record) => (
            <tr key={record._id}>
              <td>{record.title}</td>
              <td>{record.description}</td>

              {user?.role === 'admin' && (
                <td>
                  {record.createdBy?.name || 'Unknown'} (
                  {record.createdBy?.email})
                </td>
              )}

              {user?.role === 'admin' && (
                <td>
                  {new Date(record.createdAt).toLocaleString()}
                </td>
              )}

              <td>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => startEdit(record)}
                    style={{
                      marginRight: '5px',
                      background: 'yellow'
                    }}
                  >
                    Update
                  </button>
                )}

                <button
                  onClick={() => handleDelete(record._id)}
                  style={{
                    background: 'red',
                    color: 'white'
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;