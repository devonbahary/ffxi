import uuid from 'uuid';

// FETCH_SYNTHS
export const fetchSynths = () => ({
  type: 'FETCH_SYNTHS'
});

// ADD_SYNTH
export const addSynth = (synth = {
  name = '',
  crystal = 'Fire',
  craft ='Alchemy',
  lv = 1,
  type = 'profit',
  sellPrice = 0
} = {}) => ({
  type: 'ADD_SYNTH',
  synth: {
    ...synth,
    id: uuid()
  }
});

// EDIT_SYNTH
export const editSynth = (id, updates) => ({
  type: 'EDIT_SYNTH',
  id,
  updates
});

// REMOVE_SYNTH
export const removeSynth = (id) => ({
  type: 'REMOVE_SYNTH',
  id
});

// UPDATE_CRAFTS
export const updateCrafts = (updates) => ({
  type: 'UPDATE_CRAFTS',
  updates
});
