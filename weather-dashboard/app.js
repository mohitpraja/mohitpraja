/* ========== API CONFIGURATION ========== */
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Get from https://openweathermap.org/api
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

/* ========== DOM ELEMENTS ========== */
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const suggestionsContainer = document.getElementById('suggestions');
const loadingSpinner = document.getElementById('loading');
const errorMessage = document.getElementById('error');
const weatherContainer = document.getElementById('weatherContainer');
const welcomeSection = document.getElementById('welcome');

/* ========== STATE MANAGEMENT ========== */
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
let debounceTimer;

/* ========== INITIALIZATION ========== */
document.addEventListener('DOMContentLoaded', () => {
    renderRecentSearches();
    if (recentSearches.length > 0) {
        // Optional: Auto-load the last searched city
        // fetchWeather(recentSearches[0]);
    }
});

/* ========== EVENT LISTENERS ========== */
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = searchInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim();
    
    if (query.length < 2) {
        suggestionsContainer.classList.remove('show');
        return;
    }

    debounceTimer = setTimeout(() => {
        fetchSuggestions(query);
    }, 300);
});

searchInput.addEventListener('blur', () => {
    setTimeout(() => {
        suggestionsContainer.classList.remove('show');
    }, 200);
});

/* ========== FETCH WEATHER DATA ========== */
async function fetchWeather(city) {
    try {
        showLoading(true);
        hideError();

        // Get city coordinates
        const coordsData = await fetch(
            `${GEO_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
        ).then(res => {
            if (!res.ok) throw new Error('City not found');
            return res.json();
        });

        if (coordsData.length === 0) {
            throw new Error('City not found. Please try another search.');
        }

        const { lat, lon, name, country } = coordsData[0];

        // Fetch current weather and forecast
        const [currentData, forecastData] = await Promise.all([
            fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
                .then(res => res.json()),
            fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
                .then(res => res.json())
        ]);

        if (!currentData.main) {
            throw new Error('Failed to fetch weather data');
        }

        // Update UI
        displayCurrentWeather(currentData, name, country);
        displayHourlyForecast(forecastData.list);
        displayFiveDayForecast(forecastData.list);

        // Add to recent searches
        addToRecentSearches(`${name}, ${country}`);

        // Show weather container
        weatherContainer.classList.remove('hidden');
        welcomeSection.style.display = 'none';
        suggestionsContainer.classList.remove('show');

    } catch (error) {
        showError(error.message || 'An error occurred. Please try again.');
        weatherContainer.classList.add('hidden');
        welcomeSection.style.display = 'block';
    } finally {
        showLoading(false);
    }
}

/* ========== FETCH CITY SUGGESTIONS ========== */
async function fetchSuggestions(query) {
    try {
        const response = await fetch(
            `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
        );
        
        if (!response.ok) return;

        const cities = await response.json();
        displaySuggestions(cities);

    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

/* ========== DISPLAY SUGGESTIONS ========== */
function displaySuggestions(cities) {
    if (!cities.length) {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.classList.remove('show');
        return;
    }

    suggestionsContainer.innerHTML = cities.map(city => `
        <div class="suggestion-item" onclick="selectCity('${city.name}', '${city.country}')">
            <i class="fas fa-map-marker-alt"></i> ${city.name}, ${city.country}
        </div>
    `).join('');

    suggestionsContainer.classList.add('show');
}

/* ========== SELECT CITY FROM SUGGESTIONS ========== */
function selectCity(city, country) {
    searchInput.value = `${city}, ${country}`;
    suggestionsContainer.classList.remove('show');
    fetchWeather(`${city}, ${country}`);
}

/* ========== DISPLAY CURRENT WEATHER ========== */
function displayCurrentWeather(data, cityName, country) {
    const { main, weather, wind, clouds, visibility, sys, coord } = data;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;

    document.getElementById('cityName').textContent = `${cityName}, ${country}`;
    document.getElementById('dateTime').textContent = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    document.getElementById('weatherIcon').src = iconUrl;
    document.getElementById('temperature').textContent = `${Math.round(main.temp)}°C`;
    document.getElementById('weatherDescription').textContent = weather[0].description;

    document.getElementById('humidity').textContent = `${main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${(wind.speed * 3.6).toFixed(1)} km/h`;
    document.getElementById('pressure').textContent = `${main.pressure} hPa`;
    document.getElementById('visibility').textContent = `${(visibility / 1000).toFixed(1)} km`;

    document.getElementById('feelsLike').textContent = `${Math.round(main.feels_like)}°C`;
    document.getElementById('sunrise').textContent = new Date(sys.sunrise * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('sunset').textContent = new Date(sys.sunset * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('coordinates').textContent = `${coord.lat.toFixed(2)}°, ${coord.lon.toFixed(2)}°`;
}

/* ========== DISPLAY HOURLY FORECAST ========== */
function displayHourlyForecast(forecastList) {
    const hourlyForecast = document.getElementById('hourlyForecast');
    const next24Hours = forecastList.slice(0, 8); // 24 hours / 3 hour intervals

    hourlyForecast.innerHTML = next24Hours.map(item => {
        const date = new Date(item.dt * 1000);
        const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

        return `
            <div class="hourly-card">
                <div class="time">${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                <img src="${icon}" alt="${item.weather[0].description}">
                <div class="temp">${Math.round(item.main.temp)}°C</div>
                <div class="condition">${item.weather[0].main}</div>
            </div>
        `;
    }).join('');
}

/* ========== DISPLAY 5-DAY FORECAST ========== */
function displayFiveDayForecast(forecastList) {
    const fiveDayForecast = document.getElementById('fiveDayForecast');
    const dailyForecasts = {};

    // Group forecast data by date
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US');
        
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = [];
        }
        dailyForecasts[date].push(item);
    });

    // Get 5 days of data
    const fiveDays = Object.entries(dailyForecasts).slice(0, 5).map(([date, items]) => {
        const temps = items.map(item => item.main.temp);
        const maxTemp = Math.max(...temps);
        const minTemp = Math.min(...temps);
        const weather = items[Math.floor(items.length / 2)].weather[0];
        const icon = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

        return {
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            high: Math.round(maxTemp),
            low: Math.round(minTemp),
            description: weather.description,
            icon: icon
        };
    });

    fiveDayForecast.innerHTML = fiveDays.map(day => `
        <div class="forecast-card">
            <div class="date">${day.date}</div>
            <img src="${day.icon}" alt="${day.description}">
            <div class="temp-range">
                <span class="high">${day.high}°</span> / 
                <span class="low">${day.low}°</span>
            </div>
            <div class="condition">${day.description}</div>
        </div>
    `).join('');
}

/* ========== RECENT SEARCHES MANAGEMENT ========== */
function addToRecentSearches(city) {
    // Remove if already exists
    recentSearches = recentSearches.filter(c => c !== city);
    // Add to beginning
    recentSearches.unshift(city);
    // Keep only last 10
    recentSearches = recentSearches.slice(0, 10);
    // Save to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    renderRecentSearches();
}

function renderRecentSearches() {
    const container = document.getElementById('recentSearches');
    
    if (recentSearches.length === 0) {
        container.innerHTML = '<p class="text-secondary">No recent searches yet</p>';
        return;
    }

    container.innerHTML = recentSearches.map(city => `
        <div class="search-history-item">
            <i class="fas fa-history"></i>
            <span onclick="fetchWeather('${city}')" style="cursor: pointer; flex: 1;">${city}</span>
            <span class="close" onclick="removeRecentSearch('${city}')">×</span>
        </div>
    `).join('');
}

function removeRecentSearch(city) {
    recentSearches = recentSearches.filter(c => c !== city);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    renderRecentSearches();
}

/* ========== UI HELPERS ========== */
function showLoading(show) {
    loadingSpinner.classList.toggle('hidden', !show);
}

function showError(message) {
    errorMessage.textContent = `⚠️ ${message}`;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

/* ========== INSTRUCTIONS FOR API KEY SETUP ========== */
console.log(`
╔════════════════════════════════════════════════════════════╗
║  WEATHER DASHBOARD - API KEY SETUP                         ║
╚════════════════════════════════════════════════════════════╝

To use this dashboard:

1. Visit: https://openweathermap.org/api
2. Sign up for a FREE account
3. Generate an API key
4. Replace 'YOUR_OPENWEATHERMAP_API_KEY' in app.js (line 5)

Example:
const API_KEY = 'abc123def456...';

Features:
✓ Real-time weather for any city
✓ Hourly forecast (next 24 hours)
✓ 5-day weather forecast
✓ Weather details (humidity, wind, pressure, etc.)
✓ Recent search history
✓ Beautiful responsive design
`);