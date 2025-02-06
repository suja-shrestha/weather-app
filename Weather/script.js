document.addEventListener("DOMContentLoaded", () => {
  // OpenWeatherMap API key
  const apiKey = "c156a4d49861eba613b802e67490be42";

  // Selecting elements from the DOM
  const locationEl = document.getElementById("location");
  const temperatureEl = document.getElementById("temperature");
  const descriptionEl = document.getElementById("description");
  const iconEl = document.getElementById("weather-icon");
  const humidityEl = document.getElementById("humidity");
  const windSpeedEl = document.getElementById("wind-speed");
  const cityInput = document.getElementById("cityInput");
  const searchBtn = document.getElementById("searchBtn");

  // Check if the browser supports geolocation and fetch weather by coordinates
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(fetchWeatherByCoords, showError);
  } else {
    locationEl.textContent = "Geolocation is not supported.";
  }

  // Function to fetch weather data using latitude and longitude
  function fetchWeatherByCoords(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchWeather(`lat=${lat}&lon=${lon}`);
  }

  // Function to fetch weather data by city name
  //q=Kathmandu → Tells the API to fetch weather data for Kathmandu
//units=metric → Gets temperature in Celsius
//appid=YOUR_API_KEY → Authenticates the request
  function fetchWeatherByCity(city) {
    fetchWeather(`q=${city}`);
  }

  // Function to fetch weather data from OpenWeatherMap API
  function fetchWeather(query) {
    const url = `https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${apiKey}`;

    // Display loading message while fetching data
    locationEl.textContent = "Loading...";
    temperatureEl.textContent = "";
    descriptionEl.textContent = "";
    humidityEl.textContent = "";
    windSpeedEl.textContent = "";
    iconEl.style.display = "none"; // Hide weather icon initially

    // Fetching weather data
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Handle case when city is not found
        if (data.cod === "404") {
          locationEl.textContent = "City not found!";
          return;
        }

        // Updating UI with fetched weather data
        locationEl.textContent = `Location: ${data.name}, ${data.sys.country}`;
        temperatureEl.textContent = `Temperature: ${data.main.temp}°C`;
        descriptionEl.textContent = `Weather: ${data.weather[0].description}`;
        humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
        windSpeedEl.textContent = `Wind Speed: ${data.wind.speed} m/s`;

        // Setting weather icon
        iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        iconEl.style.display = "block"; // Show weather icon
      })
      .catch(() => {
        locationEl.textContent = "Error fetching weather data.";
      });
  }

  // Function to handle geolocation errors
  function showError(error) {
    locationEl.textContent = `Error: ${error.message}`;
  }

  // Event listener for the search button
  searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim(); // Get user input and remove extra spaces
    if (city) {
      fetchWeatherByCity(city);
    }
  });

  // Allow pressing "Enter" to trigger search
  cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      searchBtn.click();
    }
  });
});
