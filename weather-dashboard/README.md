# Weather Dashboard 🌤️

A beautiful, responsive weather dashboard that fetches real-time weather data from OpenWeatherMap API. Get current weather conditions, hourly forecasts, and 5-day predictions for any city in the world.

![Weather Dashboard](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square)

## ✨ Features

- 🔍 **City Search** with auto-suggestions
- 🌡️ **Real-time Weather Data** - Current temperature, conditions, and "feels like"
- 💧 **Detailed Weather Info** - Humidity, wind speed, pressure, visibility
- ⏰ **Hourly Forecast** - Weather for the next 24 hours
- 📅 **5-Day Forecast** - Daily high/low temperatures and conditions
- 🌅 **Sunrise/Sunset Times** - Track daylight hours
- 📍 **Coordinates Display** - Latitude and longitude of searched city
- 💾 **Search History** - Recently searched cities with quick access
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Dark theme with gradient accents and smooth animations
- ⚡ **Debounced Search** - Optimized API calls with debouncing
- 🖥️ **LocalStorage Support** - Persists recent searches

## 🚀 Quick Start

### Prerequisites
- Web browser (Chrome, Firefox, Safari, Edge)
- OpenWeatherMap API key (free tier available)

### Installation

1. **Get Your API Key**
   - Visit [OpenWeatherMap API](https://openweathermap.org/api)
   - Sign up for a free account
   - Navigate to API keys section
   - Copy your API key

2. **Configure API Key**
   - Open `app.js`
   - Find line 5: `const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';`
   - Replace with your actual API key:
   ```javascript
   const API_KEY = 'your_actual_api_key_here';
   ```

3. **Open in Browser**
   - Open `index.html` in your web browser
   - Or use a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (with http-server)
   npx http-server
   ```
   - Visit `http://localhost:8000/weather-dashboard/`

## 📖 Usage

1. **Search for a City**
   - Type city name in the search box
   - See auto-suggestions appear
   - Click a suggestion or press Enter to search

2. **View Weather Information**
   - Current weather with large temperature display
   - Weather description and icon
   - Detailed metrics (humidity, wind, pressure, visibility)

3. **Check Forecasts**
   - Scroll down to see hourly forecast (next 24 hours)
   - View 5-day forecast with high/low temperatures

4. **Access Recent Searches**
   - Recently searched cities appear at the bottom
   - Click to quickly search again
   - Remove from history with the × button

## 🎨 UI Components

### Current Weather Section
- City name and current date/time
- Large temperature display
- Weather icon and description
- 4 key metrics (humidity, wind speed, pressure, visibility)

### Hourly Forecast
- 8 cards (3-hour intervals)
- Temperature and weather condition
- Weather icon for visual reference

### 5-Day Forecast
- Daily forecast cards
- High/low temperatures
- Weather description

### Additional Info
- Sunrise and sunset times
- Feels-like temperature
- Exact coordinates (latitude, longitude)

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: OpenWeatherMap API (free tier)
- **Storage**: LocalStorage (for recent searches)
- **Icons**: Font Awesome 6.4.0
- **Design**: Modern dark theme with CSS variables and gradients

## 📁 Project Structure

```
weather-dashboard/
├── index.html          # Main HTML structure
├── styles.css          # Styling and animations
├── app.js              # JavaScript logic and API calls
└── README.md           # Documentation
```

## 🔧 API Endpoints Used

1. **Geocoding API**
   ```
   GET /geo/1.0/direct?q={city}&limit=5&appid={API_KEY}
   ```
   - Gets city coordinates from name
   - Returns suggestions for autocomplete

2. **Current Weather API**
   ```
   GET /data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={API_KEY}
   ```
   - Fetches current weather data

3. **Forecast API**
   ```
   GET /data/2.5/forecast?lat={lat}&lon={lon}&units=metric&appid={API_KEY}
   ```
   - Fetches 5-day forecast with 3-hour intervals

## 📊 Data Displayed

### Current Weather
- Temperature (°C)
- Feels like temperature
- Weather description
- Humidity (%)
- Wind speed (km/h)
- Pressure (hPa)
- Visibility (km)
- Sunrise/Sunset times
- Coordinates (lat, lon)

### Forecasts
- Hourly temperatures (next 24 hours)
- 5-day high/low temperatures
- Weather conditions for each period

## 🎯 Features Breakdown

### Search Functionality
- Real-time city suggestions with debouncing
- City auto-suggestions from OpenWeatherMap Geocoding API
- Recent search history with persistence
- Quick access to previously searched cities

### Display Features
- Responsive grid layout (adapts to all screen sizes)
- Smooth animations and transitions
- Hover effects on interactive elements
- Dark theme optimized for eye comfort
- Weather icons from OpenWeatherMap

### Performance
- Debounced search input (300ms delay)
- Combined API calls (parallel fetching)
- Efficient DOM updates
- LocalStorage caching of recent searches

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Customization

### Change Color Scheme
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #667eea;      /* Main accent color */
    --secondary-color: #764ba2;    /* Secondary accent */
    --dark-bg: #1a202c;            /* Background color */
    --text-primary: #e2e8f0;       /* Text color */
    /* ... more variables ... */
}
```

### Modify Temperature Units
In `app.js`, change `units=metric` to:
- `units=metric` - Celsius (default)
- `units=imperial` - Fahrenheit

## 🐛 Troubleshooting

### "City not found" Error
- Ensure city name is correct
- Check OpenWeatherMap covers that location
- Try with country code (e.g., "London, GB")

### No Suggestions Appearing
- Check API key is valid
- Verify internet connection
- Check browser console for errors (F12)

### API Rate Limit Exceeded
- Free tier has 60 calls/minute limit
- Wait a moment before making more requests
- Consider upgrading to paid plan for higher limits

### API Key Not Working
- Verify key is correctly copied to `app.js`
- Check key hasn't expired
- Ensure you've verified email on OpenWeatherMap
- Generate a new key if needed

## 📚 API Documentation

- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [Geocoding API](https://openweathermap.org/api/geocoding-api)
- [Current Weather API](https://openweathermap.org/current)
- [Forecast API](https://openweathermap.org/forecast5)

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and enhancement requests.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) - Weather data provider
- [Font Awesome](https://fontawesome.com/) - Icon library

---

Made with ❤️ by Mohit Prajapati