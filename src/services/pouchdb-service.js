import { EventEmitter } from 'events'
import PouchDB from 'pouchdb'
import PouchDBAdapterWebSQL from 'pouchdb-adapter-websql'
import PouchDBFind from 'pouchdb-find'
import uuid from 'node-uuid'
PouchDB.plugin(PouchDBFind)
PouchDB.plugin(PouchDBAdapterWebSQL)

export default class PouchDBService extends EventEmitter {
  constructor (syncURL, token) {
    super()

    this.pouchDB = new PouchDB('ktodo')
    this.pouchDB
      .sync(syncURL, {
        live: false,
        retry: true,
        back_off_function: function (delay) {
          if (delay === 0) {
            console.log('back off delay: 1000')
            return 1000 // start with 1 second
          }

          if (delay < 10000) {
            console.log('back off delay: ' + delay * 1.2)
            return delay * 1.2 // increase a little bit at a time
          }

          console.log('back off delay: 10000')
          return 10000 // don't go over 10 seconds
        },
        ajax: {
          withCredentials: false,
          timeout: 30000,
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      })
      .on('change', info => this.emit('changed', info.change.docs))
      .on('paused', info => this.emit('paused'))
      .on('active', info => this.emit('activated'))
      .on('complete', info => this.emit('completed'))
      .on('error', error => this.emit('error', error))

    this.allTodos = this.allTodos.bind(this)
    this.createTodo = this.createTodo.bind(this)
    this.updateTodo = this.updateTodo.bind(this)
    this.deleteTodo = this.deleteTodo.bind(this)
    this.getTodoById = this.getTodoById.bind(this)
  }

  allTodos () {
    return this.pouchDB
      .find({selector: {docType: 'todo'}})
      .then(data => data.docs.map(x => Object.assign(x, {id: x._id, rev: x._rev})))
  }

  getTodoById (id) {
    return this.pouchDB
      .get(id)
      .then(data => Object.assign(data, {id: data._id, rev: data._rev}))
  }

  createTodo (item) {
    return this.pouchDB
      .put(Object.assign(item, {docType: 'todo', _id: uuid.v4()}))
  }

  updateTodo (item) {
    delete item.id
    delete item.rev
    return this.pouchDB
      .put(item)
  }

  deleteTodo (item) {
    return this.pouchDB
      .remove(item._id, item._rev)
  }
}
