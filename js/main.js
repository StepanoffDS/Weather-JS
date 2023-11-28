const API_KEY = '5212eb1d627f8dbef9e2272fc5a71018'

const form = document.querySelector('#form')
const input = document.querySelector('.form__input')

form.onsubmit = submitHandler

async function submitHandler(e) {
  e.preventDefault()

  if (!input.value.trim()) {
    console.log('Enter city name')
    return
  }

  const cityName = input.value.trim()
  input.value = ''

  const cityInfo = await getGeo(cityName)

  // Если ничего не найдено, то возвращается return
  if (cityInfo.length === 0) return

  const weatherInfo = await getWeather(cityInfo[0]['lat'], cityInfo[0]['lon'])

  console.log(weatherInfo.weather[0]['main'])

  const weatherData = {
    name: weatherInfo.name,
    temp: weatherInfo.main.temp,
    humidity: weatherInfo.main.humidity,
    windSpeed: weatherInfo.wind.speed,
    main: weatherInfo.weather[0]['main']
  }

  renderWeatherData(weatherData)
}

async function getGeo(name) {
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_KEY}`
  const response = await fetch(geoUrl)
  const data = await response.json()
  return data
}

async function getWeather(lat, lon) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`
  const response = await fetch(weatherUrl)
  const data = await response.json()
  return data
}

function renderWeatherData(data) {

  document.querySelector('.weather__info').classList.remove('none')
  document.querySelector('.weather__details').classList.remove('none')

  const temp = document.querySelector('.weather__temp')
  const city = document.querySelector('.weather__city')
  const humidity = document.querySelector('#humidity')
  const windSpeed = document.querySelector('#windSpeed')
  const weatherImg = document.querySelector('.weather__img')

  temp.innerText = Math.round(data.temp) + '°C'
  city.innerText = data.name
  humidity.innerText = data.humidity + '%'
  windSpeed.innerText = data.windSpeed + ' km/h'

  const fileNames = {
    'Clouds': 'cloudy',
    'Clear': 'sunny',
    'Rain': 'rain',
  }

  if (fileNames[data.main]) {
    weatherImg.src = `./img/weather/${fileNames[data.main]}.svg`
  }


}