// frontend/src/components/ExpenseForm.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';

const CATEGORIES = ['Food', 'Travel', 'Utilities', 'Entertainment', 'Other'];

export default function ExpenseForm({ onAdd, people }) {
  const [form, setForm] = useState({
    amount: '',
    description: '',
    paid_by: '',
    category: 'Other',
    splitType: 'equal',
    splits: {}
  });
  const [errors, setErrors] = useState(null);

  // Whenever splitType or people list changes, reset splits
  useEffect(() => {
    setForm(f => ({
      ...f,
      splits:
        f.splitType === 'equal'
          ? {}
          : people.reduce((acc, p) => ({ ...acc, [p]: '' }), {})
    }));
  }, [form.splitType, people]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSplitChange = (person, value) => {
    setForm(f => ({
      ...f,
      splits: { ...f.splits, [person]: value }
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors(null);

    try {
      // Build request payload
      const payload = {
        amount: Number(form.amount),
        description: form.description,
        paid_by: form.paid_by,
        category: form.category
      };

      if (form.splitType !== 'equal') {
        payload.split = {
          type: form.splitType,
          values: Object.fromEntries(
            Object.entries(form.splits).map(([p, v]) => [p, Number(v)])
          )
        };
      }

      const res = await axios.post(`${API_BASE}/expenses`, payload);
      onAdd(res.data.data);

      // Reset form
      setForm({
        amount: '',
        description: '',
        paid_by: '',
        category: 'Other',
        splitType: 'equal',
        splits: {}
      });
    } catch (err) {
      setErrors(err.response?.data?.message || err.message);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      {errors && <p style={{ color: 'red', marginBottom: '0.5rem' }}>{errors}</p>}

      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
      />

      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
      />

      <input
        name="paid_by"
        placeholder="Paid by"
        value={form.paid_by}
        onChange={handleChange}
        required
        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
      />

      {/* Category Selector */}
      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
        Category:
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      {/* Split Type Selector */}
      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
        Split Type:
        <select
          name="splitType"
          value={form.splitType}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        >
          <option value="equal">Equal</option>
          <option value="percentage">Percentage</option>
          <option value="exact">Exact Amount</option>
        </select>
      </label>

      {/* Dynamic split inputs */}
      {form.splitType !== 'equal' &&
        people.map(person => (
          <div key={person} style={{ marginBottom: '0.5rem' }}>
            <label>
              {person}’s {form.splitType === 'percentage' ? '% share' : 'amount'}:
              <input
                type="number"
                value={form.splits[person] || ''}
                onChange={e => handleSplitChange(person, e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginTop: '0.25rem'
                }}
              />
            </label>
          </div>
        ))}

      <button
        className="btn"
        type="submit"
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#4F46E5',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '0.5rem'
        }}
      >
        Add Expense
      </button>
    </form>
  );
}
