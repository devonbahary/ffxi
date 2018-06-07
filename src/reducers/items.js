const initialState = [];

export default (prevState = initialState, action) => {
  let items;
  switch (action.type) {
    case 'FETCH_ITEMS':
      items = JSON.parse(localStorage.getItem('items'));
      return items ? items : prevState;
    case 'ADD_ITEM':
      items = [ ...prevState, action.item ];
      localStorage.setItem('items', JSON.stringify(items));
      return items;
    case 'EDIT_ITEM':
      items = prevState.map(item => item.id === action.id ? ({
        ...item,
        ...action.updates
      }) : item);
      localStorage.setItem('items', JSON.stringify(items));
      return items;
    case 'REMOVE_ITEM':
      items = prevState.filter(item => item.id !== action.id);
      localStorage.setItem('items', JSON.stringify(items));
      return items;
    default:
      return prevState;
  }
};
