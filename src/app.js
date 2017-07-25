import React from 'react'
import ReactDOM from 'react-dom'
import {
  Router,
  IndexRoute,
  Route,
  browserHistory,
} from 'react-router'
import TodoApp from './components/TodoApp'
import TodoList from './components/TodoList'
import PouchDBService from './services/pouchdb-service'
import './style.css'

const pouchDB = new PouchDBService(window.__env.ENDPOINT_URL, window.__env.TOKEN)

ReactDOM.render(
  <Router forceFetch history={browserHistory}>
    <Route path='/' component={TodoApp} pouchDB={pouchDB}>
      <IndexRoute component={TodoList} prepareParams={() => ({status: 'any'})} />
      <Route path=':status' component={TodoList} />
    </Route>
  </Router>,
  document.getElementById('root')
)
