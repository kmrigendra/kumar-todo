import Todo from './Todo'
import React, { PropTypes } from 'react'

export default class TodoList extends React.Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    pouchDB: PropTypes.object,
  }

  state = {
    allTodos: [],
  }

  constructor (props) {
    super(props)
    this.props.pouchDB.on('changed', () => this.refreshTodos())
  }

  componentDidMount () {
    this.refreshTodos()
  }

  refreshTodos () {
    this.props.pouchDB
      .allTodos()
      .then(data => this.setState({allTodos: data}))
      .catch(error => alert(error.message))
  }

  filterTodos = (item) => (
    this.props.params.status === 'active'
    ? item.complete !== true
    : this.props.params.status === 'completed'
      ? item.complete === true
      : true
    )

  renderTodos () {
    return this.state.allTodos
      .filter(this.filterTodos)
      .reverse()
      .map((item) =>
        <Todo key={item._id} todo={item} pouchDB={this.props.pouchDB} />
      )
  }

  render () {
    return (
      <section className='main'>
        <ul className='todo-list'>
          {this.renderTodos()}
        </ul>
      </section>
    )
  }
}

