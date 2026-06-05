import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getAllReadings, deleteReading } from '../utils/storage';
import './ReadingsList.css';

const ReadingsList = ({ refreshTrigger, onReadingDeleted }) => {
  const [readings, setReadings] = useState([]);
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, value-desc, value-asc

  useEffect(() => {
    loadReadings();
  }, [refreshTrigger, sortBy]);

  const loadReadings = () => {
    let allReadings = getAllReadings();
    
    // Sort readings
    allReadings.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date) || b.timestamp.localeCompare(a.timestamp);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date) || a.timestamp.localeCompare(b.timestamp);
        case 'value-desc':
          return b.value - a.value;
        case 'value-asc':
          return a.value - b.value;
        default:
          return 0;
      }
    });
    
    setReadings(allReadings);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this reading?')) {
      deleteReading(id);
      loadReadings();
      if (onReadingDeleted) {
        onReadingDeleted();
      }
    }
  };

  const getValueColor = (value) => {
    if (value < 70) return '#e74c3c'; // Red - low
    if (value <= 140) return '#27ae60'; // Green - normal
    if (value <= 170) return '#f39c12'; // Orange - elevated
    return '#e74c3c'; // Red - high
  };

  return (
    <div className="readings-list-container">
      <div className="list-header">
        <h2>All Readings ({readings.length})</h2>
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="value-desc">Value (Highest First)</option>
            <option value="value-asc">Value (Lowest First)</option>
          </select>
        </div>
      </div>

      {readings.length === 0 ? (
        <div className="no-readings">
          <p>No readings recorded yet.</p>
          <p>Add your first blood sugar reading above!</p>
        </div>
      ) : (
        <div className="readings-table-wrapper">
          <table className="readings-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time/Type</th>
                <th>Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((reading) => (
                <tr key={reading.id}>
                  <td>{format(new Date(reading.date), 'MMM dd, yyyy')}</td>
                  <td>{reading.typeLabel}</td>
                  <td>
                    <span 
                      className="value-badge"
                      style={{ backgroundColor: getValueColor(reading.value) }}
                    >
                      {reading.value} mg/dL
                    </span>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(reading.id)}
                      title="Delete reading"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReadingsList;
