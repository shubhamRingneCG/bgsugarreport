# 🩸 Blood Sugar Monitor

A comprehensive web application for tracking and visualizing blood sugar levels throughout the day. Built with React, Vite, and Chart.js.

## Features

### 📝 Data Entry
- Record blood sugar readings for 8 different times of day:
  - Early Morning
  - Before Breakfast
  - Pre Lunch
  - Post Prandial (2 hrs after lunch)
  - Evening
  - Pre Dinner
  - Post Dinner (2 hrs after)
  - 3 AM
- Date selection for recording past readings
- Input validation (1-600 mg/dL range)

### 📊 Visualization
- **Daily View**: See all readings for a specific day
- **Weekly View**: Average blood sugar levels across the week
- **Monthly View**: Daily averages throughout the month
- Interactive charts with color-coded normal ranges (70-140 mg/dL highlighted)

### 🔄 Comparison Features
- **Day vs Day**: Compare blood sugar patterns between two specific days
- **Week vs Week**: Compare weekly averages side by side
- Visual comparison with distinct colors for easy analysis

### 📋 Data Management
- View all recorded readings in a sortable table
- Sort by date (newest/oldest) or value (highest/lowest)
- Color-coded value badges:
  - 🔴 Red: Low (<70) or Very High (>200)
  - 🟢 Green: Normal (70-140)
  - 🟠 Orange: High (140-200)
- Delete individual readings

### 💾 Storage
- All data stored locally in browser's localStorage
- No server required - works completely offline
- Data persists across browser sessions

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd "bs app"
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready to deploy to any static hosting service.

## Usage Guide

### Adding a Reading
1. Select the date (defaults to today)
2. Choose the reading type from the dropdown
3. Enter the blood sugar value in mg/dL
4. Click "Save Reading"

### Viewing Charts
1. Select a view type (Daily, Weekly, or Monthly)
2. Choose a date to view data for
3. Optionally enable comparison mode to compare with another period

### Managing Data
- Scroll down to see the complete list of all readings
- Use the sort dropdown to organize readings
- Click the "Delete" button to remove unwanted readings

## Technology Stack

- **React**: UI framework
- **Vite**: Build tool and development server
- **Chart.js**: Data visualization
- **react-chartjs-2**: React wrapper for Chart.js
- **date-fns**: Date manipulation and formatting

## Browser Compatibility

Works on all modern browsers that support localStorage and ES6:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Data Privacy

All your blood sugar data is stored locally in your browser. No data is sent to any server or third party. Your health information remains completely private and under your control.

## Future Enhancements

Potential features for future versions:
- Export data to CSV/Excel
- Import data from glucose monitors
- Statistics and trends analysis
- Target range customization
- Medication/meal logging
- Multi-user support
- Cloud sync option

## License

This project is open source and available for personal use.

## Support

For issues or questions, please create an issue in the repository.

---

**Note**: This application is for personal tracking purposes only. Always consult with healthcare professionals for medical advice regarding blood sugar management.
