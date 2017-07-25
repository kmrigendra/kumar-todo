import React, { PropTypes } from 'react'
import TodoListFooter from './TodoListFooter'
import TodoTextInput from './TodoTextInput'

export default class TodoApp extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    route: PropTypes.object.isRequired,
    pouchDB: PropTypes.object,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  state = {
    allTodos: [],
    connection: 'waiting',
  }

  constructor (props) {
    super(props)
    this.props.route.pouchDB.on('changed', () => this.refreshTodos())
    this.props.route.pouchDB.on('paused', () => this.setState({connection: 'waiting'}))
    this.props.route.pouchDB.on('activated', () => this.setState({connection: 'online'}))
    this.props.route.pouchDB.on('completed', () => this.setState({connection: 'offline'}))
    this.props.route.pouchDB.on('error', () => this.setState({connection: 'error'}))
  }

  componentDidMount () {
    this.refreshTodos()
  }

  refreshTodos () {
    this.props.route.pouchDB
      .allTodos()
      .then(data => this.setState({allTodos: data}))
      .then(data => this.forceUpdate())
      .catch(error => alert(error.message))
  }

  _handleTextInputSave = (text) => {
    const item = {
      text: text,
      complete: false,
    }
    this.props.route.pouchDB
      .createTodo(item)
      .catch(error => alert(error.message))
  }

  _handleMarkAll = () => {
    const numRemainingTodos = this.state.allTodos.filter(x => !x.complete).length
    const newStatus = numRemainingTodos !== 0

    this.state.allTodos
      .filter(x => x.complete !== newStatus)
      .map(x => Object.assign(x, {complete: newStatus}))
      .forEach(todo => this.props.route.pouchDB.updateTodo(todo).catch(error => alert(error.message)))
  }

  render () {
    const hasTodos = this.state.allTodos.length > 0
    const numRemainingTodos = this.state.allTodos.filter(x => !x.complete).length
    let children = null
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        pouchDB: this.props.route.pouchDB,
      })
    }
    return (
      <div>
        <section className='todoapp'>
          <header className='header'>
            <h1>
              todos
              <div>{this.state.connection} synchronization</div>
            </h1>
            <input
              onClick={this._handleMarkAll}
              type='checkbox'
              checked={numRemainingTodos === 0}
              className='toggle-all'
              readOnly
            />
            <TodoTextInput
              autoFocus
              className='new-todo'
              onSave={this._handleTextInputSave}
              placeholder='What needs to be done?'
            />
          </header>

          {children}

          {hasTodos &&
            <TodoListFooter
              todos={this.state.allTodos}
              pouchDB={this.props.route.pouchDB}
            />
          }
        </section>
        <footer className='info'>
          <p>
            Double-click to edit a todo
          </p>
          <p>
            Created by the <a href='https://facebook.github.io/relay/'>
              Relay team
            </a>
          </p>
          <p>
            Part of <a href='http://todomvc.com'>TodoMVC</a>
          </p>
        </footer>
      </div>
    )
  }
}

