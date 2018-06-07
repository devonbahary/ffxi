const initialState = [];

export default (prevState = initialState, action) => {
  let synths;
  switch (action.type) {
    case 'FETCH_SYNTHS':
      synths = JSON.parse(localStorage.getItem('synths'));
      return synths ? synths : prevState;
    case 'ADD_SYNTH':
      synths = [ ...prevState, action.synth ];
      localStorage.setItem('synths', JSON.stringify(synths));
      return synths;
    case 'EDIT_SYNTH':
      synths = prevState.map(synth => synth.id === action.id ? ({
        ...synth,
        ...action.updates
      }) : synth);
      localStorage.setItem('synths', JSON.stringify(synths));
      return synths;
    case 'REMOVE_SYNTH':
      synths = prevState.filter(synth => synth.id !== action.id);
      localStorage.setItem('synths', JSON.stringify(synths));
      return synths;
    default:
      return prevState;
  }
};
