const fs = require('fs')
const path = require('path')
const dbPath = path.join(__dirname, "todo.json")

class Todo {

  async load() {
    return new Promise( (resolve, reject) => {
      fs.exists(dbPath, (exists) => {
        if (!exists) {
          this.createDb()
        }
        return resolve()
      })
    })
  }

  async createDb() {
    return new Promise( (resolve, reject) => {
      fs.writeFile(dbPath, "[]", (error, result) => {
        if (error) {
          reject()
        } else {
          resolve()
        }
      })
    })
  }

  async get() {
    return new Promise( (resolve, reject) => {
      fs.readFile(dbPath, "utf8", (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(JSON.parse(result))
        }
      })
    })
  }

  print(todos) {
    todos.map( (row) => {
      console.log(`${row.id}. ${row.created_at} ${row.todo}`)
    })
  }

  async add(val) {
    const todos = await this.get()
    const id = this.getNextId(todos)

    return new Promise( (resolve, reject) => {
      const newTodo = {
        id,
        todo: val,
        created_at: new Date().toISOString().replace("T", " ").slice(0,16)
      }
      todos.push(newTodo)
      fs.writeFile(dbPath, JSON.stringify(todos), (error) => {
        if (error) {
          reject()
        } else {
          resolve(todos)
        }
      })
    })
  }

  async delete(id) {
    const todos = await this.get()
    const updatedTodos = todos.filter( (obj) => {
      return obj.id !== id
    })
    return new Promise( (resolve, reject) => {
      fs.writeFile(dbPath, JSON.stringify(updatedTodos), (error) => {
        if (error) {
          reject()
        } else {
          resolve(updatedTodos)
        }
      })
    })
  }

  getNextId(arr) {
    if (arr.length > 0) {
      const last = arr.reduce( (prev, current) => {
        return (prev.id > current.id) ? prev : current
      })
      return last.id + 1
    } else {
      return 1
    }
  }

}

module.exports = Todo
