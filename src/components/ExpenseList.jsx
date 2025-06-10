// frontend/src/components/RecurringList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';

export default function RecurringList() {
  const [items, setItems] = useState([]);

  // fetch recurring templates
  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await axios.get(`${API_BASE}/recurring`);
        setItems(res.data.data);
      } catch (err) {
        console.error('Failed to load recurring templates', err);
      }
    }
    fetchTemplates();
  }, []); // no async arrow here

  // delete and reload
  const handleDelete = async id => {
    try {
      await axios.delete(`${API_BASE}/recurring/${id}`);
      // reload list
      const res = await axios.get(`${API_BASE}/recurring`);
      setItems(res.data.data);
    } catch (err) {
      console.error('Failed to delete recurring template', err);
    }
  };

  if (!items.length) {
    return <p>No recurring items.</p>;
  }

  return (
    <ul>
      {items.map(r => (
        <li key={r._id} className="card" style={{ justifyContent: 'space-between' }}>
          <div>
            <strong>{r.description}</strong> ₹{r.amount}{' '}
            <small>({r.frequency}, next: {new Date(r.nextDate).toLocaleDateString()})</small>
          </div>
          <button className="btn" onClick={() => handleDelete(r._id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
