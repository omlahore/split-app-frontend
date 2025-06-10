// frontend/src/components/RecurringForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';

const CATEGORIES  = ['Food', 'Travel', 'Utilities', 'Entertainment', 'Other'];
const FREQUENCIES = ['daily', 'weekly', 'monthly'];

export default function RecurringForm({ onAdd }) {
  const [form, setForm] = useState({
    amount:      '',
    description: '',
    paid_by:     '',
    category:    'Other',
    frequency:   'monthly',
    // today’s date in YYYY-MM-DD
    nextDate:    new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');

  // Generic handler for inputs & selects
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Submit to POST /recurring
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        amount:      Number(form.amount),
        description: form.description,
        paid_by:     form.paid_by,
        category:    form.category,
        frequency:   form.frequency,
        nextDate:    form.nextDate
      };
      const res = await axios.post(`${API_BASE}/recurring`, payload);
      onAdd(res.data.data);
      // reset to defaults
      setForm({
        amount:      '',
        description: '',
        paid_by:     '',
        category:    'Other',
        frequency:   'monthly',
        nextDate:    new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3 style={{ marginBottom: '0.5rem' }}>New Recurring Expense</h3>

      {error && (
        <p style={{ color: 'red', marginBottom: '0.5rem' }}>
          {error}
        </p>
      )}

      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
      />

      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />

      <input
        name="paid_by"
        placeholder="Paid by"
        value={form.paid_by}
        onChange={handleChange}
        required
      />

      <label>
        Category:
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label>
        Frequency:
        <select
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          required
        >
          {FREQUENCIES.map(f => (
            <option key={f} value={f}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </option>
          ))}
        </select>
      </label>

      <label>
        Next Date:
        <input
          name="nextDate"
          type="date"
          value={form.nextDate}
          onChange={handleChange}
          required
        />
      </label>

      <button className="btn" type="submit" style={{ marginTop: '0.5rem' }}>
        Create Recurring
      </button>
    </form>
  );
}
