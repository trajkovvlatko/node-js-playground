#!/usr/bin/env node

var pjson = require('./package.json')
var Weather = require('./weather.js')

async function getWeather() {
  let { app_id: appId, location } = pjson.weather
  const weather = new Weather(location, appId)

  const forecastData = await weather.get()
  const forecastTable = weather.toTable(forecastData)

  console.log(forecastTable)
}

function showInfo() {
  console.log("\nAvailable options: 'weather'\n")
  console.log("Planned: 'todos', 'news', 'traffic', 'random movie', 'random song'\n")
}

if (process.argv.length === 3) {
  switch(process.argv[2]) {
    case "weather":
      return getWeather()
    default:
      return showInfo()
  }
} else {
  return showInfo()
}
