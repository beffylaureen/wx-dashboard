//variables
var searchHistory = [];
var weatherApi = 'https://api.openweathermap.org';
var weatherApiKey = 'f9bd0742ea693f65ddf31053b50bc31a';


var citySearch = document.querySelector('#city-search');
var cityInput = document.querySelector('#city-input');
var todayWeatherContainer = document.querySelector('#today');
var forecastWeatherContainer = document.querySelector('#forecast');
var previousSearchContainer = document.querySelector('#history');

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function renderPreviousSearch(){
  previousSearchContainer.innerHTML='';
  for (var i = previousSearch.length -1; i>=0; i--){
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('data', 'forecast');
    btn.classList.add('history-btn', 'btn-history');
    btn.setAttribute('data-search', previousSearch[i]);
    btn.textContent=previousSearch[i];
    previousSearchContainer.append(btn);
  }
}

function appendPreviousSearch(search){
  if (previousSearch.indexOf(search)!== -1){
    return;
  }
  previousSearch.push(search);

  localStorage.setItem('search-history', JSON.stringify(previousSearch));
  renderPreviousSearch();
}

function initPreviousSearch(){
  var storedSearch = localStorage.getItem('search-history');
  if (storedSearch){
    previousSearch = JSON.parse(storedSearch);
  }
  renderPreviousSearch();
}
function renderTodayWeatherContainer(city, weather){
  var date = dayjs().format ('MM/DD/YYYY');
  var temp = weather.today.temp;
  var wind = weather.today.wind;
  var humid = weather.today.humid;
  var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  var iconDesc = weather.weather[0].description || weather[0].today;
  var card = document.createElement('div');
  var cardContent = document.createElement('div');
  var heading = document.createElement('h3');
  var wxIcon = document.createElement('img');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidEl = document.createElement('p');

  card.setAttribute('class', 'card');
  cardContent.setAttribute('class', 'card-content');
  card.append(cardContent);

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