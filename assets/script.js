//variables
var searchHistory = [];
var weatherApi = 'https://api.openweathermap.org';
var weatherApiKey = 'f9bd0742ea693f65ddf31053b50bc31a';

//DOM referebces
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var todayContainer = document.querySelector('#today');
var forecastContainer = document.querySelector('#forecast');
var searchHistoryContainer = document.querySelector('#history');

//Day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

//Display search history
function renderSearchHistory(){
  searchHistoryContainer.innerHTML='';
  for (var i = searchHistory.length -1; i>=0; i--){
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-controls','today forecast');
    btn.classList.add('history-btn','btn-history');
    btn.setAttribute('data-search', searchHistory[i]);
    btn.textContent=searchHistory[i];
    searchHistoryContainer.append(btn);
  }
}

//Update search history
function appendToHistory(search){
  if (searchHistory.indexOf(search)!== -1){
    return;
  }
  searchHistory.push(search);

  localStorage.setItem('search-history', JSON.stringify(searchHistory));
  renderSearchHistory();
}

function initSearchHistory(){
  var storedHistory = localStorage.getItem('search-history');
  if (storedHistory){
    searchHistory = JSON.parse(storedHistory);
  }
  renderSearchHistory();
}

//Display today's weather
function renderCurrentWeather(city, weather){
  var date = dayjs().format ('MM/DD/YYYY');
  var temp = weather.main.temp;
  var wind = weather.wind.speed;
  var humid = weather.main.humidity;
  var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  var iconDesc = weather.weather[0].description || weather[0].today;
  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var heading = document.createElement('h2');
  var wxIcon = document.createElement('img');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidEl = document.createElement('p');

  card.setAttribute('class', 'card');
  cardBody.setAttribute('class', 'card-body');
  card.append(cardBody);

  heading.setAttribute('class','h3 card-title');
  tempEl.setAttribute('class', 'card-text');
  windEl.setAttribute('class', 'card-text');
  humidEl.setAttribute('class', 'card-text');

  heading.textContent = `${city}(${date})`;
  wxIcon.setAttribute('src', iconUrl);
  wxIcon.setAttribute('alt', iconDesc);
  wxIcon.setAttribute('class', 'weather-img');
  heading.append(wxIcon);
  tempEl.textContent = `Temp: ${temp} degrees`;
  windEl.textContent = `Wind: ${wind} miles per hour`;
  humidEl.textContent = `Humidity: ${humid} %`;
  cardContent.append(heading, tempEl, windEl, humidEl);

  todayContainer.innerHTML='';
  todayContainer.append(card);

function renderForecastWeatherContainer(forecast){
  var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
  var iconDesc = forecast.weather[0].description;
  var temp = weather.forecast.temp;
  var wind = weather.forecast.wind;
  var humid = weather.forecast.humid;
  var comp = document.createElement('div');
  var card = document.createElement('div');
  var cardContent = document.createElement('div');
  var cardTitle = document.createElement('h4');
  var wxIcon = document.createElement('img');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidEl = document.createElement('p');

  comp.append(card);
  card.append(cardContent);
  cardContent.append(cardTitle, wxIcon, tempEl, windEl, humidEl);

  comp.setAttribute('class', 'comp-md');
  comp.classList.add('forecast-card');
  card.setAttribute('class', 'card bg-light h-100 text-black');
  cardContent.setAttribute('class', 'card-body p-3');
  cardTitle.setAttribute('class', 'card-title');
  tempEl.setAttribute('class', 'card-text');
  windEl.setAttribute('class', 'card-text');
  humidEl.setAttribute('class', 'card-text');

  cardTitle.textContent = dayjs(forecast.dt_txt).format('MM/DD/YYYY');
  wxIcon.setAttribute('src', iconUrl);
  wxIcon.setAttribute('alt', iconDesc);
  tempEl.textContent = `Temp: ${tempF} degrees`;
  windEl.textContent = `Wind: ${windMph} miles per hour`;
  humidEl.textContent = `Humidity: ${humidity} %`;

  forecastContainer.append(comp);

  function renderForecast(futureForecast){
    var startDt = dayjs().add(1, 'day').startOf('day').unix();
    var endDt = dayjs().add(6, 'day').startOf('day').unix();
    var headingComp = document.createElement('div');
    var heading = document.createElement('h5');

    headingComp.setAttribute('class', 'col-12');
    heading.textContent = 'Five-day Forecast:';
    heading.headingComp.append(heading);

    forecastContainer.innerHTML = '';
    forecastContainer.append(headingComp);

    for (var i = 0; i < futureForecast.length; i++){
      if (futureForecast[i].dt >= startDt && futureForecast[i].dt < endDt){
        if (futureForecast[i].dt_txt.slice(11, 13)=="12") {
          renderForecast(futureForecast[i]);
        }
      }
    }
  }
  function renderItems(city, data){
    renderTodayWeather(city, data.list[0], data.city);
    renderFuture(data.list);
  }
  function fetchWeather(location){
    var { lat } = location;
    var { lon } = location;
    var city = location.city
    var apiUrl = `${weatherApi}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;
  }
    fetch(apiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        renderItems(city, data);
      })
}
function fetchCoords(search) {
  var apiUrl = `${weatherApi}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert('Location not found');
      } else {
        appendToHistory(search);
        fetchWeather(data[0]);
      }
    })
}
function handleSearchSubmit(e){
  if (!cityInput.value){
    return;
  }
  e.preventDefault();
  var search = cityInput.value();
  fetchCoords(search);
  cityInput.value = '';
}

function handlePreviousSearchClick(e){
  if (!e.target.matches('btn-history')){
    return;
  }
  var btn = e.target;
  var search = btn.getAttribute('data-search');
  fetchCoords(search);
}
initPreviousSearch();
citySearch.addEventListener('submit', handleSearchSubmit);
searchHistoryContainer.addEventListener('click', handlePreviousSearchClick);
}