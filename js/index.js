const API_KEY = 'fcd7cedda45a2338bb3be4bb589fc6b5'
const weather_mappings = {
    'thunderstorm': {
        'background': 'https://images.unsplash.com/photo-1529354106868-9d7821ecaac2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
        'primary': '#15455f',
        'option_pane_bg': 'rgb(21, 69, 95, 0.6)'
    },
    'drizzle': {
        'background': 'https://images.unsplash.com/photo-1496034663057-6245f11be793?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
        'primary': '#0b2507',
        'option_pane_bg': 'rgb(11, 37, 7, 0.6)'
    },
    'rain': {
        'background': 'https://images.unsplash.com/photo-1511634829096-045a111727eb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2834&q=80',
        'primary': '#1f2e1c',
        'option_pane_bg': 'rgb(131, 140, 136, 0.6)'
    },
    'snow': {
        'background': 'https://images.unsplash.com/photo-1642623883157-cd5b06ae6c45?q=80&w=2750&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'primary': '#58c6f5',
        'option_pane_bg': 'rgba(191, 236, 255, 0.2)'
    },
    'clear': {
        'background': 'https://images.unsplash.com/photo-1507384428463-9ad93c924971?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
        'primary': '#27468f',
        'option_pane_bg': 'rgba(191, 225, 255, 0.6)'
    },
    'clouds': {
        'background': 'https://images.unsplash.com/photo-1443694910004-3567042689f5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2067&q=80',
        'primary': '#15455f',
        'option_pane_bg': 'rgb(21,69,95, 0.6)'
    },
    'others': {
        'background': 'https://images.unsplash.com/photo-1584237863847-b21b4f7ccd4f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2198&q=80',
        'primary': '#634024',
        'option_pane_bg': 'rgb(194, 158, 117, 0.6)'
    },
}

const recentCities = ['Mumbai', 'Arizona', 'London', 'Cape Town']

$(document).ready(function () {

    setWeatherDetails('london')
    $("#get-weather").click(async function () {
        const location = $("#location-input").val()
        // const coordinates = await getLocationLatLong(location)        
        const city = await setWeatherDetails(location)        
        if(city != '')
            setRecentCitiesList(city)
    })

    $(".grid-container .options-pane #city-list").on('click', 'li', async function () {
        const location = $(this).text()
        // const coordinates = await getLocationLatLong(location)
        await setWeatherDetails(location)        
    })

    $("#location-input").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#get-weather").click();
        }
    });
    
})

function setRecentCitiesList(location){
    if(recentCities.includes(location)) return
    recentCities.unshift(location)
    recentCities.pop()
    $('#city-list').empty()
    recentCities.forEach(city => {
        $('#city-list').append(`<li>${city}</li>`);
    });
}

// async function getLocationWeather(location) {
//     let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`)
//     let data = await response.json()
//     console.log(data)
//     return data
// }

function setCurrentCityTime(timezone){
    d = new Date()
    localTime = d.getTime()
    localOffset = d.getTimezoneOffset() * 60000
    utc = localTime + localOffset
    var atlanta = utc + (1000 * timezone)
    nd = new Date(atlanta)

    var minutes = nd.getMinutes();
    var hours = nd.getHours();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours < 10 ? '0'+hours : hours;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    $('#current-city-time').text(`${hours} : ${minutes} ${ampm}, ${days[nd.getDay()]}`)
    // $('#current-city-time').text(hours + ' : ' + nd.getMinutes() + ', ' + days[nd.getDay()])
}

async function setWeatherDetails(location) {

    if(location == '' || location == undefined)
        return

    $('#loader').removeClass('hidden')

    const weatherDetails = await getLocationWeather(location)

    if(weatherDetails.cod == 404){
        $('#loader').addClass('hidden')
        return ''
    }        

    setCurrentCityTime(weatherDetails.timezone)
    
    $("#degree-value").text(Math.round(weatherDetails.main.temp))
    $("#current-city").text(weatherDetails.name)

    var forecast = weatherDetails.weather[0].main
    $("#weather-forecast").text(forecast)

    let background_image = weather_mappings.others.background
    if (weather_mappings.hasOwnProperty(forecast.toLowerCase())) {
        background_image = weather_mappings[forecast.toLowerCase()].background
        document.documentElement.style.setProperty('--primary', weather_mappings[forecast.toLowerCase()].primary)
        document.documentElement.style.setProperty('--option-pane-bg', weather_mappings[forecast.toLowerCase()].option_pane_bg)
    }
    else{
        document.documentElement.style.setProperty('--primary', weather_mappings.others.primary)
        document.documentElement.style.setProperty('--option-pane-bg', weather_mappings.others.option_pane_bg)
    }


    var tmpImg = new Image() ;
    tmpImg.src = background_image;
    tmpImg.onload = function() {
        $('body').css('background-image', `url(${background_image})`)
        var iconurl = "http://openweathermap.org/img/w/" + weatherDetails.weather[0].icon + ".png"
        $("#weather-icon").attr('src', iconurl)
        $('#loader').addClass('hidden')
    } ;
    
    setWeatherExtras(weatherDetails)
    return weatherDetails.name
}

function setWeatherExtras(weatherDetails){
    $('#weather-extras').empty()

    if (weatherDetails.hasOwnProperty('clouds')) {
        $('#weather-extras').append(`<div>
            <span class="label">Cloudy</span>
            <span class="value bold">${weatherDetails.clouds.all} %</span>
        </div>`);    
    }

    if (weatherDetails.hasOwnProperty('rain')) {
        $('#weather-extras').append(`<div>
            <span class="label">Rain</span>
            <span class="value bold">${weatherDetails.rain['1h']} mm</span>
        </div>`);    
    }

    if (weatherDetails.hasOwnProperty('snow')) {
        $('#weather-extras').append(`<div>
            <span class="label">Snow</span>
            <span class="value bold">${weatherDetails.snow['1h']} mm</span>
        </div>`);    
    }

    if (weatherDetails['main'].hasOwnProperty('humidity')) {
        $('#weather-extras').append(`<div>
            <span class="label">Humidity</span>
            <span class="value bold">${weatherDetails.main.humidity} %</span>
        </div>`);    
    }

    if (weatherDetails.hasOwnProperty('wind')) {
        $('#weather-extras').append(`<div>
            <span class="label">Wind Speed</span>
            <span class="value bold">${weatherDetails.wind.speed} m/s</span>
        </div>`);    
    }

    if (weatherDetails.hasOwnProperty('visibility')) {
        $('#weather-extras').append(`<div>
            <span class="label">Wind Speed</span>
            <span class="value bold">${weatherDetails.visibility} m</span>
        </div>`);    
    }
}

async function getLocationLatLong(location){
    let response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`)
    let data = await response.json()
    return data
}

async function getLocationWeather(location){    
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`)
    let data = await response.json()
    console.log(data)
    return data    
}

