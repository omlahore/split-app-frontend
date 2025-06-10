// frontend/src/components/CategorySummary.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';

export default function CategorySummary() {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/expenses/categories`).then(res => {
      setCats(res.data.data);
    });
  }, []);

  if (!cats.length) return <p>No category data yet.</p>;

  return (
    <div className="settlement" style={{ marginTop:'2rem' }}>
      <h3>Spending by Category</h3>
      <ul>
        {cats.map(c => (
          <li key={c.category} style={{ display:'flex', justifyContent:'space-between' }}>
            <span>{c.category} ({c.count})</span>
            <span style={{ fontWeight:'bold' }}>₹{c.totalAmount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
