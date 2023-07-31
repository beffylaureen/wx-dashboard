//variables

var weatherApi = 'https://api.openweathermap.org';
var weatherApiKey = 'f9bd0742ea693f65ddf31053b50bc31a';
var searchHistory = [];

var citySearch = document.querySelector('#city-search');
var cityInput = document.querySelector('#city-input');
var todayWeather = document.querySelector('#today');
var forecastWeather = document.querySelector('#forecast');
var searchHistory = document.querySelector('#history');

function renderSearchHistory(){
  searchHistoryContainer.innerHTML='';
  for (var i = searchHistory.length -1; i>=0; i--){
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('data', 'forecast');
    btn.classList.add('history-btn', 'btn-history');
    btn.setAttribute('data-search', searchHistory[i]);
    btn.textContent=searchHistory[i];
    searchHistoryContainer.append(btn);
  }
}

function appendPastSearch(search){
  if (searchHistory.indexOf(search)!==-1){
    return;
  }
  searchHistory.push(search);

  localStorage.setItem('search-history', JSON.stringify(searchHistory));
  renderSearchHistory();
}
function renderTodayWeather(city, weather){
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

  


}