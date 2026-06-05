import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, subWeeks, subMonths } from 'date-fns';
import { getAllReadings, getReadingsByDate, getReadingsByDateRange, READING_TYPES } from '../utils/storage';
import './ChartView.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartView = ({ refreshTrigger }) => {
  const [viewType, setViewType] = useState('daily'); // daily, weekly, monthly
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [comparisonMode, setComparisonMode] = useState('none'); // none, day, week
  const [comparisonDate, setComparisonDate] = useState('');
  const [chartData, setChartData] = useState(null);

  // Helper function to get color based on blood sugar value
  const getValueColor = (value) => {
    if (value === null) return null;
    if (value < 70) return '#e74c3c'; // Red
    if (value <= 140) return '#27ae60'; // Green
    if (value <= 170) return '#f39c12'; // Orange
    return '#e74c3c'; // Red (>170)
  };

  const getValueBorderColor = (value) => {
    if (value === null) return null;
    if (value < 70) return '#c0392b'; // Dark red
    if (value <= 140) return '#229954'; // Dark green
    if (value <= 170) return '#e67e22'; // Dark orange
    return '#c0392b'; // Dark red (>170)
  };

  useEffect(() => {
    updateChartData();
  }, [viewType, selectedDate, comparisonMode, comparisonDate, refreshTrigger]);

  const updateChartData = () => {
    const date = new Date(selectedDate);
    let data;

    if (comparisonMode !== 'none' && comparisonDate) {
      data = getComparisonData();
    } else {
      switch (viewType) {
        case 'daily':
          data = getDailyData(date);
          break;
        case 'weekly':
          data = getWeeklyData(date);
          break;
        case 'monthly':
          data = getMonthlyData(date);
          break;
        default:
          data = getDailyData(date);
      }
    }

    setChartData(data);
  };

  const getDailyData = (date) => {
    const readings = getReadingsByDate(date);
    const typeOrder = Object.keys(READING_TYPES);
    
    const labels = typeOrder.map(key => READING_TYPES[key]);
    const values = typeOrder.map(key => {
      const reading = readings.find(r => r.type === key);
      return reading ? reading.value : null;
    });

    // Color points based on value
    const pointColors = values.map(v => getValueColor(v) || 'rgba(75, 192, 192, 0.6)');
    const pointBorderColors = values.map(v => getValueBorderColor(v) || 'rgb(75, 192, 192)');

    return {
      labels,
      datasets: [
        {
          label: `Blood Sugar - ${format(date, 'MMM dd, yyyy')}`,
          data: values,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          pointBackgroundColor: pointColors,
          pointBorderColor: pointBorderColors,
          pointRadius: 6,
          pointHoverRadius: 8,
          tension: 0.1,
          spanGaps: true
        }
      ]
    };
  };

  const getWeeklyData = (date) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    const readings = getReadingsByDateRange(weekStart, weekEnd);
    
    const labels = days.map(d => format(d, 'EEE MM/dd'));
    const avgValues = days.map(day => {
      const dayReadings = readings.filter(r => 
        new Date(r.date).toDateString() === day.toDateString()
      );
      if (dayReadings.length === 0) return null;
      const sum = dayReadings.reduce((acc, r) => acc + r.value, 0);
      return Math.round(sum / dayReadings.length);
    });

    // Color points based on average value
    const pointColors = avgValues.map(v => getValueColor(v) || 'rgba(54, 162, 235, 0.6)');
    const pointBorderColors = avgValues.map(v => getValueBorderColor(v) || 'rgb(54, 162, 235)');

    return {
      labels,
      datasets: [
        {
          label: `Weekly Average - ${format(weekStart, 'MMM dd')} to ${format(weekEnd, 'MMM dd, yyyy')}`,
          data: avgValues,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          pointBackgroundColor: pointColors,
          pointBorderColor: pointBorderColors,
          pointRadius: 6,
          pointHoverRadius: 8,
          tension: 0.1,
          spanGaps: true
        }
      ]
    };
  };

  const getMonthlyData = (date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const readings = getReadingsByDateRange(monthStart, monthEnd);
    
    const labels = days.map(d => format(d, 'dd'));
    const avgValues = days.map(day => {
      const dayReadings = readings.filter(r => 
        new Date(r.date).toDateString() === day.toDateString()
      );
      if (dayReadings.length === 0) return null;
      const sum = dayReadings.reduce((acc, r) => acc + r.value, 0);
      return Math.round(sum / dayReadings.length);
    });

    // Color points based on average value
    const pointColors = avgValues.map(v => getValueColor(v) || 'rgba(255, 99, 132, 0.6)');
    const pointBorderColors = avgValues.map(v => getValueBorderColor(v) || 'rgb(255, 99, 132)');

    return {
      labels,
      datasets: [
        {
          label: `Monthly Average - ${format(date, 'MMMM yyyy')}`,
          data: avgValues,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          pointBackgroundColor: pointColors,
          pointBorderColor: pointBorderColors,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1,
          spanGaps: true
        }
      ]
    };
  };

  const getComparisonData = () => {
    const date1 = new Date(selectedDate);
    const date2 = new Date(comparisonDate);

    if (comparisonMode === 'day') {
      const readings1 = getReadingsByDate(date1);
      const readings2 = getReadingsByDate(date2);
      const typeOrder = Object.keys(READING_TYPES);
      
      const labels = typeOrder.map(key => READING_TYPES[key]);
      const values1 = typeOrder.map(key => {
        const reading = readings1.find(r => r.type === key);
        return reading ? reading.value : null;
      });
      const values2 = typeOrder.map(key => {
        const reading = readings2.find(r => r.type === key);
        return reading ? reading.value : null;
      });

      // Color points for dataset 1
      const pointColors1 = values1.map(v => getValueColor(v) || 'rgba(75, 192, 192, 0.6)');
      const pointBorderColors1 = values1.map(v => getValueBorderColor(v) || 'rgb(75, 192, 192)');

      // Color points for dataset 2
      const pointColors2 = values2.map(v => getValueColor(v) || 'rgba(255, 99, 132, 0.6)');
      const pointBorderColors2 = values2.map(v => getValueBorderColor(v) || 'rgb(255, 99, 132)');

      return {
        labels,
        datasets: [
          {
            label: format(date1, 'MMM dd, yyyy'),
            data: values1,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            pointBackgroundColor: pointColors1,
            pointBorderColor: pointBorderColors1,
            pointRadius: 6,
            pointHoverRadius: 8,
            tension: 0.1,
            spanGaps: true
          },
          {
            label: format(date2, 'MMM dd, yyyy'),
            data: values2,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            pointBackgroundColor: pointColors2,
            pointBorderColor: pointBorderColors2,
            pointRadius: 6,
            pointHoverRadius: 8,
            tension: 0.1,
            spanGaps: true
          }
        ]
      };
    } else if (comparisonMode === 'week') {
      const week1Start = startOfWeek(date1, { weekStartsOn: 1 });
      const week1End = endOfWeek(date1, { weekStartsOn: 1 });
      const week2Start = startOfWeek(date2, { weekStartsOn: 1 });
      const week2End = endOfWeek(date2, { weekStartsOn: 1 });
      
      const days1 = eachDayOfInterval({ start: week1Start, end: week1End });
      const days2 = eachDayOfInterval({ start: week2Start, end: week2End });
      
      const readings1 = getReadingsByDateRange(week1Start, week1End);
      const readings2 = getReadingsByDateRange(week2Start, week2End);
      
      const labels = days1.map((d, i) => `Day ${i + 1}`);
      
      const avgValues1 = days1.map(day => {
        const dayReadings = readings1.filter(r => 
          new Date(r.date).toDateString() === day.toDateString()
        );
        if (dayReadings.length === 0) return null;
        const sum = dayReadings.reduce((acc, r) => acc + r.value, 0);
        return Math.round(sum / dayReadings.length);
      });

      const avgValues2 = days2.map(day => {
        const dayReadings = readings2.filter(r => 
          new Date(r.date).toDateString() === day.toDateString()
        );
        if (dayReadings.length === 0) return null;
        const sum = dayReadings.reduce((acc, r) => acc + r.value, 0);
        return Math.round(sum / dayReadings.length);
      });

      // Color points for week 1
      const pointColors1 = avgValues1.map(v => getValueColor(v) || 'rgba(75, 192, 192, 0.6)');
      const pointBorderColors1 = avgValues1.map(v => getValueBorderColor(v) || 'rgb(75, 192, 192)');

      // Color points for week 2
      const pointColors2 = avgValues2.map(v => getValueColor(v) || 'rgba(255, 99, 132, 0.6)');
      const pointBorderColors2 = avgValues2.map(v => getValueBorderColor(v) || 'rgb(255, 99, 132)');

      return {
        labels,
        datasets: [
          {
            label: `Week of ${format(week1Start, 'MMM dd')}`,
            data: avgValues1,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            pointBackgroundColor: pointColors1,
            pointBorderColor: pointBorderColors1,
            pointRadius: 6,
            pointHoverRadius: 8,
            tension: 0.1,
            spanGaps: true
          },
          {
            label: `Week of ${format(week2Start, 'MMM dd')}`,
            data: avgValues2,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            pointBackgroundColor: pointColors2,
            pointBorderColor: pointBorderColors2,
            pointRadius: 6,
            pointHoverRadius: 8,
            tension: 0.1,
            spanGaps: true
          }
        ]
      };
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Blood Sugar Levels',
        font: {
          size: 18
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} mg/dL`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 50,
        max: 300,
        title: {
          display: true,
          text: 'Blood Sugar (mg/dL)'
        },
        grid: {
          color: function(context) {
            // Highlight normal range (70-160)
            if (context.tick.value >= 70 && context.tick.value <= 160) {
              return 'rgba(75, 192, 192, 0.1)';
            }
            return 'rgba(0, 0, 0, 0.1)';
          }
        }
      }
    }
  };

  return (
    <div className="chart-view-container">
      <div className="controls">
        <div className="view-controls">
          <h3>View Type</h3>
          <div className="button-group">
            <button 
              className={viewType === 'daily' ? 'active' : ''}
              onClick={() => { setViewType('daily'); setComparisonMode('none'); }}
            >
              Daily
            </button>
            <button 
              className={viewType === 'weekly' ? 'active' : ''}
              onClick={() => { setViewType('weekly'); setComparisonMode('none'); }}
            >
              Weekly
            </button>
            <button 
              className={viewType === 'monthly' ? 'active' : ''}
              onClick={() => { setViewType('monthly'); setComparisonMode('none'); }}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="date-controls">
          <h3>Select Date</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="comparison-controls">
          <h3>Comparison</h3>
          <select 
            value={comparisonMode} 
            onChange={(e) => setComparisonMode(e.target.value)}
          >
            <option value="none">No Comparison</option>
            <option value="day">Compare Days</option>
            <option value="week">Compare Weeks</option>
          </select>
          
          {comparisonMode !== 'none' && (
            <div className="comparison-date">
              <label>Compare with:</label>
              <input
                type="date"
                value={comparisonDate}
                onChange={(e) => setComparisonDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          )}
        </div>
      </div>

      <div className="chart-container">
        {chartData && chartData.datasets[0].data.some(v => v !== null) ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="no-data">
            <p>No data available for the selected period.</p>
            <p>Start by adding some blood sugar readings!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartView;
