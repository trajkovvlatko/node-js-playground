#!/usr/bin/env node

const pjson = require('./package.json')
const Weather = require('./weather.js')
const News = require('./news.js')

async function getWeather() {
  const { app_id: appId, location } = pjson.weather
  const weather = new Weather(location, appId)

  const forecastData = await weather.get()
  const forecastTable = weather.toTable(forecastData)

  console.log(forecastTable)
}

async function getNews() {
  const { api_key: apiKey } = pjson.newsapi
  const news = new News(apiKey)
  await news.ask()
  const newsData = await news.get()
  if (newsData.status !== "error")
    news.present(newsData.articles)
  else
    news.error(newsData.message)
}

function showInfo() {
  console.log("\nAvailable options: 'weather'\n")
  console.log("Planned: 'todos', 'news', 'traffic', 'random movie', 'random song'\n")
}

if (process.argv.length === 3) {
  switch(process.argv[2]) {
    case "weather":
      return getWeather()
    case "news":
      return getNews()
    default:
      return showInfo()
  }
} else {
  return showInfo()
}
