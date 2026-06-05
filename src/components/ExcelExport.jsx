import { utils, writeFile } from 'xlsx';
import { format } from 'date-fns';
import { getAllReadings, READING_TYPES } from '../utils/storage';
import './ExcelExport.css';

const ExcelExport = () => {
  const exportToExcel = () => {
    const readings = getAllReadings();
    
    if (readings.length === 0) {
      alert('No data to export. Please add some readings first.');
      return;
    }

    // Sort readings by date and type
    const sortedReadings = [...readings].sort((a, b) => {
      const dateCompare = new Date(a.date) - new Date(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.timestamp.localeCompare(b.timestamp);
    });

    // Prepare data for Excel
    const excelData = sortedReadings.map(reading => ({
      'Date': format(new Date(reading.date), 'MM/dd/yyyy'),
      'Reading Type': reading.typeLabel,
      'Blood Sugar (mg/dL)': reading.value,
      'Status': getStatus(reading.value),
      'Recorded At': format(new Date(reading.timestamp), 'MM/dd/yyyy hh:mm:ss a')
    }));

    // Calculate statistics
    const values = readings.map(r => r.value);
    const avgValue = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const normalCount = values.filter(v => v >= 70 && v <= 140).length;
    const elevatedCount = values.filter(v => v > 140 && v <= 170).length;
    const highCount = values.filter(v => v > 170).length;
    const lowCount = values.filter(v => v < 70).length;

    // Create summary data
    const summaryData = [
      { 'Metric': 'Total Readings', 'Value': readings.length },
      { 'Metric': 'Average Blood Sugar', 'Value': `${avgValue} mg/dL` },
      { 'Metric': 'Highest Reading', 'Value': `${maxValue} mg/dL` },
      { 'Metric': 'Lowest Reading', 'Value': `${minValue} mg/dL` },
      { 'Metric': 'Normal Readings (70-140)', 'Value': normalCount },
      { 'Metric': 'Elevated Readings (140-170)', 'Value': elevatedCount },
      { 'Metric': 'High Readings (>170)', 'Value': highCount },
      { 'Metric': 'Low Readings (<70)', 'Value': lowCount },
      { 'Metric': 'Report Generated', 'Value': format(new Date(), 'MM/dd/yyyy hh:mm:ss a') }
    ];

    // Create workbook
    const wb = utils.book_new();
    
    // Add Summary sheet
    const summarySheet = utils.json_to_sheet(summaryData);
    utils.book_append_sheet(wb, summarySheet, 'Summary');
    
    // Add All Readings sheet
    const readingsSheet = utils.json_to_sheet(excelData);
    utils.book_append_sheet(wb, readingsSheet, 'All Readings');

    // Group by date for daily summary
    const dailySummary = {};
    sortedReadings.forEach(reading => {
      const dateKey = format(new Date(reading.date), 'MM/dd/yyyy');
      if (!dailySummary[dateKey]) {
        dailySummary[dateKey] = [];
      }
      dailySummary[dateKey].push(reading.value);
    });

    const dailyData = Object.entries(dailySummary).map(([date, values]) => ({
      'Date': date,
      'Number of Readings': values.length,
      'Average': Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      'Highest': Math.max(...values),
      'Lowest': Math.min(...values)
    }));

    const dailySheet = utils.json_to_sheet(dailyData);
    utils.book_append_sheet(wb, dailySheet, 'Daily Summary');

    // Download file
    const fileName = `Blood_Sugar_Report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    writeFile(wb, fileName);
    
    alert(`Excel report downloaded successfully as "${fileName}"!`);
  };

  const getStatus = (value) => {
    if (value < 70) return 'LOW';
    if (value <= 140) return 'NORMAL';
    if (value <= 170) return 'ELEVATED';
    return 'HIGH';
  };

  return (
    <div className="excel-export-container">
      <h2>📊 Export Report</h2>
      <p>Download a comprehensive Excel report with all your blood sugar data</p>
      <button onClick={exportToExcel} className="export-btn">
        📥 Download Excel Report
      </button>
      <div className="export-info">
        <p><strong>The report includes:</strong></p>
        <ul>
          <li>Summary statistics (average, min, max, counts)</li>
          <li>Complete list of all readings with timestamps</li>
          <li>Daily summary with averages</li>
        </ul>
      </div>
    </div>
  );
};

export default ExcelExport;
