// frontend/src/App.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from './config';
import ExpenseForm         from './components/ExpenseForm';
import ExpenseList         from './components/ExpenseList';
import SettlementSummary   from './components/SettlementSummary';
import CategorySummary     from './components/CategorySummary';
import RecurringForm       from './components/RecurringForm';
import AnalyticsDashboard  from './components/AnalyticsDashboard';
import RecurringList       from './components/RecurringList';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [people,   setPeople]   = useState([]);

  // load expenses & people once
  useEffect(() => {
    async function loadData() {
      try {
        const [exRes, pplRes] = await Promise.all([
          axios.get(`${API_BASE}/expenses`),
          axios.get(`${API_BASE}/settlements/people`)
        ]);
        setExpenses(exRes.data.data);
        setPeople(pplRes.data.people);
      } catch (err) {
        console.error('Failed to load initial data', err);
      }
    }
    loadData();
  }, []);

  // shared refresh function
  const refreshAll = async () => {
    try {
      const [exRes, pplRes] = await Promise.all([
        axios.get(`${API_BASE}/expenses`),
        axios.get(`${API_BASE}/settlements/people`)
      ]);
      setExpenses(exRes.data.data);
      setPeople(pplRes.data.people);
    } catch (err) {
      console.error('Refresh failed', err);
    }
  };

  // when a one‐off or recurring item is added, refresh everything
  const handleAdd = newItem => {
    refreshAll();
  };

  return (
    <div className="container">
      <h1>Split-App by Om Lahorey (22211442)</h1>

      <ExpenseForm onAdd={handleAdd} people={people} />

      <h2>All Expenses</h2>
      <ExpenseList expenses={expenses} refresh={refreshAll} />

      <SettlementSummary />

      <CategorySummary />
      <AnalyticsDashboard />

      <h2 className="mt-4">Recurring Templates</h2>
      <RecurringForm onAdd={handleAdd} />
      <RecurringList />
    </div>
  );
}
