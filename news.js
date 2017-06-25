const axios = require('axios')
const readline = require('readline')

class News {

  constructor(apiKey) {
    this.apiKey = apiKey
  }

  ask() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    function askSource() {
      return new Promise((resolve) => {
        const sources = ['google-news', 'bbc-news', 'mtv-news', 'reuters',
          'the-guardian-uk', 'the-new-york-times', 'time', 'buzzfeed',
          'cnn', 'engaged', 'hacker-news', 'mashable', 'new-scientist',
          'reddit-r-all', 'techradar', 'the-next-web', 'the-verge']
        rl.question(`Source: ${sources} (google-news) `, (source) => {
          source = source || "google-news"
          resolve(source)
        })
      })
    }

    function askSort(source) {
      return new Promise((resolve) => {
        rl.question("Sort by: ['top', 'latest', 'popular'] (top) ", (sort) => {
          rl.close()
          sort = sort || "top"
          resolve({source, sort})
        })
      })
    }

    return askSource()
      .then(askSort)
      .then(this.setQueryParams.bind(this))
  }

  setQueryParams(answers) {
    this.source = answers.source
    this.sort = answers.sort
  }

  async get() {
    var url = "https://newsapi.org/v1/articles"
    url += "?source=" + this.source
    url += "&sortBy=" + this.sort
    url += "&apiKey=" + this.apiKey

    try {
      const news = await axios(url)
      return news.data
    } catch (err) {
      return err.response.data
    }
  }

  present(articles) {
    articles.forEach( function(item) {
      console.log("-----------------------------------------------------------")
      console.log('\x1b[36m', item.title,'\x1b[0m')
      if (item.description)
        console.log(item.description)
      console.log(item.url)
    })
  }

  error(message) {
    console.log(message)
  }

}

module.exports = News
