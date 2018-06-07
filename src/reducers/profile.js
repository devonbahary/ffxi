import originalMissionsList from '../db/originalMissionsList';

const initialState = {
  name: '',
  sanDOriaFame: 1,
  bastokFame: 1,
  windurstFame: 1,
  jeunoFame: 1,
  tenshodoFame: 1,
  originalMissionIndex: 0,
  rozMissionIndex: 0,
  copMissionIndex: 0,
  toauMissionIndex: 0,
  wotgMissionIndex: 0,
  soaMissionIndex: 0,
  rovMissionIndex: 0
};

export default (prevState = initialState, action) => {
  let profile;
  switch (action.type) {
    case 'FETCH_PROFILE':
      profile = JSON.parse(localStorage.getItem('profile'));
      return profile ? profile : prevState;
    case 'UPDATE_PROFILE':
      profile = {
        ...prevState,
        ...action.updates
      };
      localStorage.setItem('profile', JSON.stringify(profile));
      return profile;
    default:
      return prevState;
  }
};
