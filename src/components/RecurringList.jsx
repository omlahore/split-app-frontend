// frontend/src/components/RecurringList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';

export default function RecurringList() {
  const [list, setList] = useState([]);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await axios.get(`${API_BASE}/recurring`);
        setList(res.data.data);
      } catch (err) {
        console.error('Failed to load recurring templates', err);
      }
    }
    fetchTemplates();
  }, []); // no async on the outer function

  const remove = async id => {
    try {
      await axios.delete(`${API_BASE}/recurring/${id}`);
      // reload after delete
      const res = await axios.get(`${API_BASE}/recurring`);
      setList(res.data.data);
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  if (!list.length) return <p>No recurring items.</p>;

  return (
    <ul>
      {list.map(r => (
        <li key={r._id} className="card" style={{ justifyContent: 'space-between' }}>
          <div>
            <strong>{r.description}</strong> ₹{r.amount}{' '}
            <small>({r.frequency}, next: {new Date(r.nextDate).toLocaleDateString()})</small>
          </div>
          <button className="btn" onClick={() => remove(r._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
