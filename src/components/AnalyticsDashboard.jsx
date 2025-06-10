import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';

export default function AnalyticsDashboard() {
  const [monthly,      setMonthly]      = useState([]);
  const [patterns,     setPatterns]     = useState(null);
  const [topExpenses,  setTopExpenses]  = useState([]);
  const [topCategories,setTopCategories]= useState([]);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [msRes, spRes, teRes, tcRes] = await Promise.all([
          axios.get(`${API_BASE}/analytics/monthly-summary`),
          axios.get(`${API_BASE}/analytics/spending-patterns`),
          axios.get(`${API_BASE}/analytics/top-expenses?limit=5`),
          axios.get(`${API_BASE}/analytics/top-categories?limit=5`),
        ]);

        setMonthly(msRes.data.data);
        setPatterns(spRes.data.data);
        setTopExpenses(teRes.data.data);
        setTopCategories(tcRes.data.data);
      } catch (err) {
        console.error('Failed to load analytics', err);
      }
    }
    fetchAnalytics();
  }, []);

  return (
    <div className="analytics mt-5">
      <h2>Analytics</h2>

      <section className="mt-3">
        <h3>Monthly Spending</h3>
        {monthly.length === 0
          ? <p>No data.</p>
          : monthly.map(m => (
              <div key={`${m.year}-${m.month}`} className="mb-2">
                <strong>{m.year}-{String(m.month).padStart(2,'0')}</strong>: ₹{m.total}
                <ul>
                  {m.categories.map(cat => (
                    <li key={cat.category}>
                      {cat.category}: ₹{cat.total} ({cat.count} txns)
                    </li>
                  ))}
                </ul>
              </div>
            ))
        }
      </section>

      <section className="mt-4">
        <h3>Group vs Individual Spending</h3>
        {!patterns
          ? <p>No data.</p>
          : (
            <div>
              <p>Group Total: ₹{patterns.groupTotal}</p>
              <p>Members: {patterns.memberCount}</p>
              <p>Avg per Person: ₹{patterns.groupAverage}</p>
              <ul>
                {patterns.members.map(m => (
                  <li key={m.person}>
                    {m.person}: ₹{m.spent} ({m.count} txns)
                  </li>
                ))}
              </ul>
            </div>
          )
        }
      </section>

      <section className="mt-4">
        <h3>Top Transactions</h3>
        {topExpenses.length === 0
          ? <p>No data.</p>
          : (
            <ul>
              {topExpenses.map(exp => (
                <li key={exp._id || exp.id}>
                  ₹{exp.amount} – {exp.description} (by {exp.paid_by} on{' '}
                  {new Date(exp.createdAt).toLocaleDateString()})
                </li>
              ))}
            </ul>
          )
        }
      </section>

      <section className="mt-4 mb-5">
        <h3>Top Categories</h3>
        {topCategories.length === 0
          ? <p>No data.</p>
          : (
            <ul>
              {topCategories.map(cat => (
                <li key={cat.category}>
                  {cat.category}: ₹{cat.total}
                </li>
              ))}
            </ul>
          )
        }
      </section>
    </div>
  );
}
