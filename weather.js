const axios = require('axios')
var table = require('easy-table')

class Weather {

  constructor(location, appId) {
    this.location = location
    this.appId = appId
  }

  async get() {
    var url = "http://api.openweathermap.org/data/2.5/forecast"
    url += "?q=" + this.location
    url += "&mode=json"
    url += "&units=metric"
    url += "&appid=" + this.appId

    try {
      const weather = await axios(url)
      return this.parse(weather.data.list)

    } catch (err) {
      return {}
    }
  }

  getTime(dt) {
    dt = parseInt(dt + "000")
    return new Date(dt).toLocaleString().slice(0, 15)
  }

  getPercentClouds(clouds) {
    if (clouds && clouds.all)
      return clouds.all.toFixed(2) + "%"
    else
      return "0%"
  }

  getMmFall(value) {
    if (value && value["3h"])
      return value["3h"].toFixed(2) + "mm"
    else
      return "0mm"
  }

  getIcon(weather) {
    switch (weather.toLowerCase()) {
      case "clear":
        return '\u2600'
      case "clouds":
        return '\u2601'
      case "thunderstorm":
        return '\u26A1'
      case "rain":
        return '\u2614'
      case "snow":
        return '\u2744'
      case "drizzle":
        return '\u2614'
      default:
        return ""
    }
  }

  parse(data) {
    return data.map( (item) => {
      const { description, main } = item.weather[0]
      return {
        time: this.getTime(item.dt),
        temperature: item.main.temp.toFixed(2) + "°C",
        main: main,
        description: description[0].toUpperCase() + description.slice(1),
        clouds: this.getPercentClouds(item.clouds),
        rain: this.getMmFall(item.rain),
        snow: this.getMmFall(item.snow),
        icon: this.getIcon(main),
      }
    })
  }

  toTable(data) {
    var t = new table()
    data.forEach( function(item) {
      t.cell("  ", item.icon)
      t.cell("Time", item.time)
      t.cell("Description", item.description)
      t.cell("Temperature", item.temperature)
      t.newRow()
    })
    return t.toString()
  }

}

module.exports = Weather
