//variables
var searchHistory = [];
var weatherApiRootUrl = 'https://api.openweathermap.org';
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
  cardBody.append(heading, tempEl, windEl, humidEl);

  todayContainer.innerHTML='';
  todayContainer.append(card);
}
//Dispay forecast card
function renderForecastCard(forecast){
  var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
  var iconDesc = forecast.weather[0].description;
  var temp = forecast.main.temp;
  var wind = forecast.wind.speed;
  var humid = forecast.main.humid;
  //create card
  var col = document.createElement('div');
  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var cardTitle = document.createElement('h5');
  var wxIcon = document.createElement('img');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, wxIcon, tempEl, windEl, humidEl);

  col.setAttribute('class', 'col-md');
  col.classList.add('five-day-card');
  card.setAttribute('class', 'card bg-light h-100 text-black');
  cardBody.setAttribute('class', 'card-body p-2');
  cardTitle.setAttribute('class', 'card-title');
  tempEl.setAttribute('class', 'card-text');
  windEl.setAttribute('class', 'card-text');
  humidEl.setAttribute('class', 'card-text');

  cardTitle.textContent = dayjs(forecast.dt_txt).format('MM/DD/YYYY');
  wxIcon.setAttribute('src', iconUrl);
  wxIcon.setAttribute('alt', iconDesc);
  tempEl.textContent = `Temp: ${temp} degrees`;
  windEl.textContent = `Wind: ${windMph} miles per hour`;
  humidEl.textContent = `Humidity: ${humidity} %`;

  forecastContainer.append(col);

  //Display forecast
  function renderForecast(dailyForecast){
    var startDt = dayjs().add(1, 'day').startOf('day').unix();
    var endDt = dayjs().add(6, 'day').startOf('day').unix();
    var headingCol = document.createElement('div');
    var heading = document.createElement('h4');

    headingCol.setAttribute('class', 'col-12');
    heading.textContent = '5-day Forecast:';
    headingCol.append(heading);

    forecastContainer.innerHTML = '';
    forecastContainer.append(headingCol);

    for (var i = 0; i < dailyForecast.length; i++){
      if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt){
        if (dailyForecast[i].dt_txt.slice(11, 13)=="12") {
          renderForecastCard(dailyForecast[i]);
        }
      }
    }
  }
  function renderItems(city, data){
    renderCurrentWeather(city, data.list[0], data.city.timezone);
    renderForecast(data.list);
  }
  //Fetches weather by geolocation
  function fetchWeather(location) {
    var { lat } = location;
    var { lon } = location;
    var city = location.name;
    var apiUrl = `${weatherApiRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;
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
  var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;

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
    .catch(function (err){
      console.error(err);
    });
}
function handleSearchFormSubmit(e){
  if (!searchInput.value){
    return;
  }
  e.preventDefault();
  var search = searchInput.value.trim();
  fetchCoords(search);
  searchInput.value = '';
}

function handleSearchHistoryClick(e){
  if (!e.target.matches('btn-history')){
    return;
  }
  var btn = e.target;
  var search = btn.getAttribute('data-search');
  fetchCoords(search);
}
initSearchHistory();
searchForm.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);
