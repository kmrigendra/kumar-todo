import React, { PropTypes } from 'react'
import classnames from 'classnames'
import TodoTextInput from './TodoTextInput'

export default class Todo extends React.Component {

  static propTypes = {
    todo: PropTypes.object.isRequired,
    pouchDB: PropTypes.object,
  }

  state = {
    isEditing: false,
  }

  _handleCompleteChange = e => {
    this.props.todo.complete = e.target.checked
    this.props.pouchDB
      .updateTodo(this.props.todo)
      .catch(error => alert(error.message))
  }

  _handleDestroyClick = () => {
    this._removeTodo()
  }

  _handleLabelDoubleClick = () => {
    this._setEditMode(true)
  }

  _handleTextInputCancel = () => {
    this._setEditMode(false)
  }

  _handleTextInputDelete = () => {
    this._setEditMode(false)
    this._removeTodo()
  }

  _handleTextInputSave = text => {
    this._setEditMode(false)
    this.props.todo.text = text
    this.props.pouchDB
      .updateTodo(this.props.todo)
      .catch(error => alert(error.message))
  }

  _removeTodo () {
    this.props.pouchDB
      .deleteTodo(this.props.todo)
      .catch(error => alert(error.message))
  }

  _setEditMode = (shouldEdit) => {
    this.setState({isEditing: shouldEdit})
  }

  renderTextInput () {
    return (
      <TodoTextInput
        className='edit'
        commitOnBlur
        initialValue={this.props.todo.text}
        onCancel={this._handleTextInputCancel}
        onDelete={this._handleTextInputDelete}
        onSave={this._handleTextInputSave}
      />
    )
  }

  render () {
    return (
      <li
        className={classnames({
          completed: this.props.todo.complete,
          editing: this.state.isEditing,
        })}>
        <div className='view'>
          <input
            checked={this.props.todo.complete}
            className='toggle'
            onChange={this._handleCompleteChange}
            type='checkbox'
          />
          <label onDoubleClick={this._handleLabelDoubleClick}>
            {this.props.todo.text}
          </label>
          <button
            className='destroy'
            onClick={this._handleDestroyClick}
          />
        </div>
        {this.state.isEditing && this.renderTextInput()}
      </li>
    )
  }
}
