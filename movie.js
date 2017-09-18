const axios = require('axios')
const readline = require('readline')

class Movie {

  constructor(apiKey, host) {
    this.apiKey = apiKey
    this.host = host
  }

  async getGenres() {
    const url = `${this.host}/genre/movie/list?api_key=${this.apiKey}`
    try {
      const response = await axios(url)
      const genres = response.data.genres
      const sortedGenres = genres.sort( function(a, b) {
        return a.id - b.id
      })
      return {
        sortedGenres,
        status_code: response.status,
      }
    } catch (err) {
      return err.response.data
    }
  }

  async askGenres(genres) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    return new Promise( (resolve) => {
      const question = genres.reduce( function(acc, row) {
        return `${acc}\r\n${row.id}. ${row.name}`
      }, "")
      rl.question(`${question} \r\n\r\nPick genres: (35,14): `, (genreIds) => {
        if (genreIds) {
          rl.close()
          resolve({
            status_code: 200,
            genreIds,
          })
        } else {
          rl.close()
          resolve({
            status_code: 400,
            status_message: "Invalid input.",
          })
        }
      })
    })
  }

  async get(genreIds) {
    const params = `api_key=${this.apiKey}&with_genres=${genreIds}`
    const url = `${this.host}/discover/movie?${params}`
    try {
      const response = await axios(url)
      const movies = response.data.results.map( function (item) {
        return item.original_title
      })
      return {
        status_code: 200,
        movies,
      }
    } catch (err) {
      return err.response.data
    }
  }

  print(movies) {
    const output = movies.reduce( (acc, movie) => {
      return `${acc}\r\n${movie}`
    }, "")
    console.log(`\r\nResults: \r\n${output}`)
  }

}

module.exports = Movie
