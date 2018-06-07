import uuid from 'uuid';

// FETCH_ITEMS
export const fetchItems = () => ({
  type: 'FETCH_ITEMS'
});

// ADD_ITEM
export const addItem = (item = {
  name = '',
  source = 'AH',
  sourceName = '',
  sourceLocation = '',
  cost = 0
} = {}) => ({
  type: 'ADD_ITEM',
  item: {
    ...item,
    id: uuid()
  }
});

// EDIT_ITEM
export const editItem = (id, updates) => ({
  type: 'EDIT_ITEM',
  id,
  updates
});

// REMOVE_ITEM
export const removeItem = (id) => ({
  type: 'REMOVE_ITEM',
  id
});
