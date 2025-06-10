// frontend/src/components/SettlementSummary.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';

export default function SettlementSummary() {
  const [txns, setTxns] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/settlements`).then(res => {
      setTxns(res.data.transactions);
    });
  }, []);

  if (!txns.length) {
    return <div className="settlement"><p>No settlements needed.</p></div>;
  }

  return (
    <div className="settlement">
      <h3>Who owes whom</h3>
      <ul>
        {txns.map((t,i) => (
          <li key={i} style={{ display:'flex', justifyContent:'space-between' }}>
            <span>{t.from} pays {t.to}</span>
            <span style={{ fontWeight:'bold' }}>₹{t.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
