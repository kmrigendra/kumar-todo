import {IndexLink, Link} from 'react-router'
import React, { PropTypes } from 'react'

export default class TodoListFooter extends React.Component {

  static propTypes = {
    todos: PropTypes.array.isRequired,
    pouchDB: PropTypes.object,
  }

  _handleRemoveCompletedTodosPress = () => {
    const completedTodos = this.props.todos.filter((x) => x.complete)

    completedTodos.forEach(todo =>
      this.props.pouchDB
        .deleteTodo(todo)
        .catch(error => alert(error.message))
    )
  }

  render () {
    const numRemainingTodos = this.props.todos.filter((x) => !x.complete).length
    const numCompletedTodos = this.props.todos.filter((x) => x.complete).length
    return (
      <footer className='footer'>
        <span className='todo-count'>
          <strong>{numRemainingTodos}</strong> item{numRemainingTodos === 1 ? '' : 's'} left
        </span>
        <ul className='filters'>
          <li>
            <IndexLink to='/' activeClassName='selected'>All</IndexLink>
          </li>
          <li>
            <Link to='/active' activeClassName='selected'>Active</Link>
          </li>
          <li>
            <Link to='/completed' activeClassName='selected'>Completed</Link>
          </li>
        </ul>
        {numCompletedTodos > 0 &&
          <span onClick={this._handleRemoveCompletedTodosPress} className='clear-completed'>
            Clear completed
          </span>
        }
      </footer>
    )
  }
}
