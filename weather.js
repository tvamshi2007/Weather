    const API_KEY = "https://api.open-meteo.com/v1/forecast";
    const searchInput = document.getElementById("search");
    const resultDiv = document.getElementById("result");
    const statusDiv = document.getElementById("status");
    let debounceTimer;

    // Debounced search
    searchInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      const query = searchInput.value.trim();
      if (!query) {
        resultDiv.innerHTML = "";
        statusDiv.textContent = "";
        return;
      }

      debounceTimer = setTimeout(() => {
        getWeather(query);
      }, 600);
    });

    // Fetch weather details
    async function getWeather(city) {
      resultDiv.innerHTML = "";
      statusDiv.textContent = "Loading...";
      statusDiv.className = "loading";

      try {
        // First get coordinates of the city
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0)
          throw new Error("City not found");

        const { latitude, longitude, name, country } = geoData.results[0];

        // Then fetch weather for coordinates
        const weatherRes = await fetch(
          `${API_KEY}?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const weatherData = await weatherRes.json();

        displayWeather(name, country, weatherData.current_weather);
        statusDiv.textContent = "";
      } catch (error) {
        statusDiv.textContent = "City not found 😢";
        statusDiv.className = "error";
      }
    }

    function displayWeather(city, country, weather) {
      resultDiv.innerHTML = `
        <div class="card">
          <h2>${city}, ${country}</h2>
          <p class="temp">${weather.temperature}°C</p>
          <p class="desc">Wind: ${weather.windspeed} km/h</p>
          <p class="desc">Weather Code: ${weather.weathercode}</p>
        </div>
      `;
    }