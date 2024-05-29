const express = require('express');
const app = express();
const port = 3000;

const apiKey = "6b6b36b0a57db3d36e0cc8dc0df2adee";
const _cities = ["Kyiv", "Cherkasy", "lviv"];
app.use('/weather/', express.static('views'));

app.get('/', (req, res) => {
    res.redirect('/weather');
});

app.get('/weather', (req, res) => {
    const weather = {
        cities: _cities
    };
    res.render('weather.hbs', {weather});
});

app.get(`/weather/:city`, async (req, res, next) => {
    const city = req.params.city;
    getWeather(city, apiKey)
        .then(weather => {
            res.render('city.hbs', {weather});
        })
        .catch(error => {
            const city = req.params.city;
            res.render('notFound.hbs', {city});
        });
});


app.use('/', (req, res, next) => {
    res.send('Неправильний URL. Повернутися на <a href=\"/weather\">головну сторінку</a>.');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

function getWeather(city, apiKey) {
    return new Promise((resolve, reject) => {
        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Помилка з\'єднання з OpenWeatherMap API.');
                }
                return response.json();
            })
            .then(data => {
                const weatherData = {
                    city: data.name,
                    temperature: Math.round(data.main.temp - 273.15),
                    description: data.weather[0].description,
                    icon: data.weather[0].icon
                };
                resolve(weatherData);
            })
            .catch(error => {
                reject(error);
            });
    });
}
