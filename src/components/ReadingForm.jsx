import { useState } from 'react';
import { READING_TYPES, saveReading } from '../utils/storage';
import './ReadingForm.css';

const ReadingForm = ({ onReadingAdded }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    date: today,
    type: 'EARLY_MORNING',
    value: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.value || formData.value <= 0) {
      alert('Please enter a valid blood sugar value');
      return;
    }

    try {
      const reading = {
        date: formData.date,
        type: formData.type,
        typeLabel: READING_TYPES[formData.type],
        value: parseFloat(formData.value)
      };
      
      saveReading(reading);
      
      // Reset form
      setFormData({
        date: today,
        type: 'EARLY_MORNING',
        value: ''
      });
      
      if (onReadingAdded) {
        onReadingAdded();
      }
      
      alert('Reading saved successfully!');
    } catch (error) {
      alert('Error saving reading. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="reading-form-container">
      <h2>Add Blood Sugar Reading</h2>
      <form onSubmit={handleSubmit} className="reading-form">
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            max={today}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Reading Type:</label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
          >
            {Object.entries(READING_TYPES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="value">Blood Sugar Level (mg/dL):</label>
          <input
            type="number"
            id="value"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            placeholder="Enter value"
            min="1"
            max="600"
            step="1"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Save Reading
        </button>
      </form>
    </div>
  );
};

export default ReadingForm;
