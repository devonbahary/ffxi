import React from 'react';
import { connect } from 'react-redux'
import { editTask, removeTask } from '../../actions/tasks';
import TaskForm from './TaskForm';

class TaskItem extends React.Component {
  state = {
    isEdit: false
  };

  editTask = (updates) => {
    this.props.editTask(updates);
    this.setState(() => ({ isEdit: false }));
  };

  handleToggleEdit = (e) => {
    e.stopPropagation();
    this.setState((prevState) => ({ isEdit: !prevState.isEdit }));
  };

  handleRemove = (e) => {
    e.stopPropagation();
    this.props.removeTask();
  };

  handleClick = () => {
    this.props.editTask({
      accomplished: !this.props.task.accomplished
    });
  };

  render() {
    const { text } = this.props.task;
    return (
      <div className="TaskItem">
        {this.state.isEdit ? (
          <TaskForm task={this.props.task} onSubmit={this.editTask} onCancel={this.handleToggleEdit} />
        ) : (
          <div className="TaskItem__clickable" onClick={this.handleClick}>
            <span className={this.props.task.accomplished ? "TaskItem__textAccomplished" : ""}>{text}</span>
            <div className="TaskItem__buttons">
              <button type="button" onClick={this.handleToggleEdit}>
                Edit
              </button>
              <button type="button" onClick={this.handleRemove}>
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  editTask: (updates) => dispatch(editTask(ownProps.task.id, updates)),
  removeTask: () => dispatch(removeTask(ownProps.task.id))
});

export default connect(undefined, mapDispatchToProps)(TaskItem);
