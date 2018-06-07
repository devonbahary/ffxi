import uuid from 'uuid';

// FETCH_TASKS
export const fetchTasks = () => ({
  type: 'FETCH_TASKS'
});

// ADD_TASK
export const addTask = (task = {
  text = '',
  accomplished = false
} = {}) => ({
  type: 'ADD_TASK',
  task: {
    ...task,
    id: uuid()
  }
});

// EDIT_TASK
export const editTask = (id, updates) => ({
  type: 'EDIT_TASK',
  id,
  updates
});

// REMOVE_TASK
export const removeTask = (id) => ({
  type: 'REMOVE_TASK',
  id
});
