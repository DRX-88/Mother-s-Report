document.addEventListener("DOMContentLoaded", () => {
  buildHistoryElement();


  const locationInput = document.getElementById("locationInput");
  const searchButton = document.getElementById("search-button");
  const weatherData = document.getElementById("weatherData");
  const forecastCards = document.getElementById("forecast-days");
  const apiKey = "8d9cfd428ce391276f5c0c34bb6b1c27";

  searchButton.addEventListener("click", () => {

    let location = locationInput.value;
    location = location.trim();


    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
    const fData = url
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const { name, main, weather, wind } = data;

        document.getElementById("locationName").textContent = name;
        document.getElementById("weatherDescription").textContent = weather[0].description;document.getElementById("temp").textContent = `${main.temp.toFixed()} °C`;
        document.getElementById("humidity").textContent = `${main.humidity} %`;
        document.getElementById("wind-speed").textContent = `${wind.speed.toFixed()} m/s`;


        weatherData.style.display = "block";


        addHistory(location);


        buildHistoryElement();
      })
      .catch((error) => console.error("Error fetching weather data:", error));

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;
    fetch(forecastUrl)
      .then((response) => response.json())

      .then((data) => {
        const forecastList = data.list;

        forecastCards.innerHTML = "";

        for (let i = 0; i < forecastList.length; i += 8) {

          const forecast = forecastList[i];
          const forecastDate = new Date(forecast.dt * 1000);
          const forecastCard = document.createElement("div");

          forecastCard.classList.add("col-lg-6", "col-md-3");

          forecastCard.innerHTML = `
                <div class="card bg-secondary text-light">
                  <div class="card-body">
                    <h5 class="card-title">${forecastDate.toLocaleDateString(
            "en-US",
            { weekday: "long" }
          )} ${forecastDate.toLocaleDateString({
            weekday: "long",
          })}</h5>
                    <p class="card-text">Forecast Time : ${forecastDate.toLocaleTimeString(
            "en-US",
            { hour: "numeric" }
          )}
                    <p class="card-text"><i class="bi bi-cup-hot-fill"></i>Temp : ${forecast.main.temp.toFixed()} °C |
                    <i class="bi bi-tornado"></i>Wind speed : ${forecast.wind.speed.toFixed()} MPH |
                    <i class="bi bi-droplet-half"></i>Humidity : ${forecast.main.humidity} |
                    Expected : ${forecast.weather[0].description}</p>
                  </div>
                </div>
              `;
  
          forecastCards.appendChild(forecastCard);
        }
      })
      .catch((error) => console.error("Error during fetch:", error));
  });
});


const searchOption = document.getElementById("cities");
const hideEl = document.getElementById("history");

searchOption.addEventListener("click", (event) => {
  const clickedLine = event.target.innerHTML;

  locationInput.value = clickedLine;

  searchOption.style.display = "none";
});


hideEL.addEventListener("click", (event) => {
  if (searchOption.style.display === "none") {
    searchOption.style.display = "initial";
  } else {
    searchOption.style.display = "none";
  }
});


function getHistory() {
  let history = JSON.parse(localStorage.getItem("cities")) || [
    "Toronto",
    "Tokyo",
    "Guayaquil",
    "Whistler",
    "Osaka",
  ];
  return history;
}

function addHistory(historyItem) {
  let history = getHistory();
  history.push(historyItem);
  history = history.filter((value, index) => history.indexOf(value) === index);
  localStorage.setItem("cities", JSON.stringify(history));
  return history;
}

function buildHistoryElement() {
  const history = getHistory();
  const searchHistory = document.getElementById("cities");
  searchHistory.innerHTML = "";
  
  for (let historyItem of history) {
    const item = document.createElement("a");
    item.className = "list-group-item list-group-item-action";
    item.textContent = historyItem;
    searchHistory.appendChild(item);
  }
}
