const initialState = [];

export default (prevState = initialState, action) => {
  let tasks;
  switch (action.type) {
    case 'FETCH_TASKS':
      tasks = JSON.parse(localStorage.getItem('tasks'));
      return tasks ? tasks : prevState;
    case 'ADD_TASK':
      tasks = [ ...prevState, action.task ];
      localStorage.setItem('tasks', JSON.stringify(tasks));
      return tasks;
    case 'EDIT_TASK':
      tasks = prevState.map(task => task.id === action.id ? ({
        ...task,
        ...action.updates
      }) : task);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      return tasks;
    case 'REMOVE_TASK':
      tasks = prevState.filter(task => task.id !== action.id);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      return tasks;
    default:
      return prevState;
  }
};
