const initialState = {
  items: [],
  crafts: {
    alchemy: 0,
    bonecraft: 0,
    clothcraft: 0,
    cooking: 0,
    fishing: 0,
    goldsmithing: 0,
    leathercraft: 0,
    smithing: 0,
    woodworking: 0
  }
};

export default (prevState = initialState, action) => {
  let synths, crafts;
  switch (action.type) {
    case 'FETCH_SYNTHS':
      synths = JSON.parse(localStorage.getItem('synths'));
      crafts = JSON.parse(localStorage.getItem('crafts'));
      return {
        items: synths ? synths : prevState.items,
        crafts: crafts ? crafts : prevState.crafts
      };
    case 'ADD_SYNTH':
      synths = [ ...prevState.items, action.synth ];
      localStorage.setItem('synths', JSON.stringify(synths));
      return {
        items: synths,
        crafts: prevState.crafts
      };
    case 'EDIT_SYNTH':
      synths = prevState.items.map(synth => synth.id === action.id ? ({
        ...synth,
        ...action.updates
      }) : synth);
      localStorage.setItem('synths', JSON.stringify(synths));
      return {
        items: synths,
        crafts: prevState.crafts
      };
    case 'REMOVE_SYNTH':
      synths = prevState.items.filter(synth => synth.id !== action.id);
      localStorage.setItem('synths', JSON.stringify(synths));
      return {
        items: synths,
        crafts: prevState.crafts
      };
    case 'UPDATE_CRAFTS':
      crafts = {
        ...prevState.crafts,
        ...action.updates
      };
      localStorage.setItem('crafts', JSON.stringify(crafts));
      return {
        items: prevState.items,
        crafts
      };
    default:
      return prevState;
  }
};
