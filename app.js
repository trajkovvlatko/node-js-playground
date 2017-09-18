#!/usr/bin/env node

const pjson = require('./package.json')
const Weather = require('./weather.js')
const News = require('./news.js')
const Todo = require('./todo.js')
const Movie = require('./movie.js')

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

async function todos() {
  const action = process.argv[3]
  const val = process.argv[4]

  const todo = new Todo()
  await todo.load()
  const todos = await todo.get()

  switch(action) {
    case "add":
      return todo.print(await todo.add(val))
    case "del":
      const id = parseInt(val)
      return todo.print(await todo.delete(id))
    default:
      return todo.print(todos)
  }
}

async function movie() {
  const genre = process.argv[3]
  const {
    api_key: apiKey,
    host: host
  } = pjson.themoviedb

  const movie = new Movie(apiKey, host)
  const genresResponse = await movie.getGenres()
  if (genresResponse.status_code !== 200) {
    console.log(genresResponse.status_message)
    return false
  }
  const genreIdsResponse = await movie.askGenres(genresResponse.sortedGenres)
  if (genreIdsResponse.status_code !== 200) {
    console.log(genreIdsResponse.status_message)
    return false
  }
  const moviesResponse = await movie.get(genreIdsResponse.genreIds)
  if (moviesResponse.status_code !== 200) {
    console.log(moviesResponse.status_message)
    return false
  }
  return movie.print(moviesResponse.movies)
}

function showInfo() {
  console.log("\nAvailable options: 'weather', 'news', 'todo'\n")
  console.log("Planned: 'traffic', 'random movie', 'random song'\n")
}

if (process.argv.length > 2) {
  switch(process.argv[2]) {
    case "weather":
      return getWeather()
    case "news":
      return getNews()
    case "todo":
      return todos()
    case "movie":
      return movie()
    default:
      return showInfo()
  }
} else {
  return showInfo()
}
