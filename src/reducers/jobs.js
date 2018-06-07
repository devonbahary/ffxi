const initialState = {
  war: 1, mnk: 1, whm: 1,
  blm: 1, rdm: 1, thf: 1,
  pld: 0, drk: 0, bst: 0, brd: 0, rng: 0, smn: 0,
  nin: 0, drg: 0, sam: 0,
  blu: 0, cor: 0, pup: 0,
  dnc: 0, sch: 0,
  geo: 0, run: 0
};

export default (prevState = initialState, action) => {
  let jobs;
  switch (action.type) {
    case 'FETCH_JOBS':
      jobs = JSON.parse(localStorage.getItem('jobs'));
      return jobs ? jobs : prevState;
    case 'UPDATE_JOBS':
      jobs = {
        ...prevState,
        ...action.updates
      };
      localStorage.setItem('jobs', JSON.stringify(jobs));
      return jobs;
    default:
      return prevState;
  }
};
