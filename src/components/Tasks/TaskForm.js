import React from 'react';

class TaskForm extends React.Component {
  state = {
    text: this.props.task ? this.props.task.text : '',
    accomplished: this.props.task ? this.props.task.accomplished : false
  };

  handleTextChange = (e) => {
    const text = e.target.value;
    this.setState(() => ({ text }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit(this.state);
    this.setState(() => ({
      text: '',
      accomplished: false
    }))
  };

  render() {
    return (
      <form
        className="TaskForm"
        onSubmit={this.handleSubmit}
      >
        <input
          type="text"
          placeholder={this.props.task ? `edit task` : 'add task'}
          value={this.state.text}
          onChange={this.handleTextChange}
          autoFocus
          required
        />
        <button type="submit">
          {!!this.props.task ? 'Update' : 'Add Task'}
        </button>
        {this.props.task && (
          <button type="button" onClick={this.props.onCancel}>
            Cancel
          </button>
        )}
      </form>
    );
  }
}

export default TaskForm;
