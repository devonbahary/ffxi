import React from 'react';
import { connect } from 'react-redux';
import { addTask } from '../../actions/tasks';
import Heading from '../Heading';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

class Tasks extends React.Component {
  state = {
    isAddTask: false
  };

  addTask = (task) => {
    this.props.addTask(task);
    this.setState(() => ({ isAddTask: false }));
  };

  handleToggleAddTask = () => this.setState((prevState) => ({ isAddTask: !prevState.isAddTask }));

  render() {
    return (
      <div className="Tasks">
        <Heading>
          Tasks
        </Heading>
        <div className="Tasks__contents">
          {this.props.tasks.length > 0 ? (
            <ul>
              {this.props.tasks.map(task => (
                <li key={task.id}>
                  <TaskItem task={task} />
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks found.</p>
          )}
          <button
            type="button"
            className={this.state.isAddTask ? "Tasks__addTaskButton--close" : "Tasks__addTaskButton"}
            onClick={this.handleToggleAddTask}
          >
            {this.state.isAddTask ? 'Close' : 'Add Task'}
          </button>
          {this.state.isAddTask && (
            <TaskForm onSubmit={this.addTask} />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tasks: state.tasks
});

const mapDispatchToProps = (dispatch) => ({
  addTask: (task) => dispatch(addTask(task))
});

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
