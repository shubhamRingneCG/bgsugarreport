import { useState } from 'react';
import ReadingForm from './components/ReadingForm';
import ChartView from './components/ChartView';
import ReadingsList from './components/ReadingsList';
import ExcelExport from './components/ExcelExport';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleExit = () => {
    if (window.confirm('All your data has been saved locally. Do you want to close the application?')) {
      window.close();
      // If window.close() doesn't work (browser security), show a message
      setTimeout(() => {
        alert('Your data is saved! You can safely close this browser tab.');
      }, 100);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>🩸 Blood Sugar Monitor</h1>
            <p>Track and visualize your blood sugar levels</p>
          </div>
          <button className="exit-btn" onClick={handleExit} title="Exit Application">
            ✕
          </button>
        </div>
      </header>

      <main className="app-main">
        <ReadingForm onReadingAdded={handleDataChange} />
        <ChartView refreshTrigger={refreshTrigger} />
        <ReadingsList 
          refreshTrigger={refreshTrigger} 
          onReadingDeleted={handleDataChange}
        />
        <ExcelExport />
      </main>

      <footer className="app-footer">
        <p>Blood Sugar Monitor © 2026 | Data stored locally in your browser</p>
      </footer>
    </div>
  );
}

export default App;
