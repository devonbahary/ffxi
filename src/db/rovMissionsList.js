export default [
  ...([...Array(18).keys()].map(i => `1-${i + 1}`)),
  ...([...Array(41).keys()].map(i => `2-${i + 1}`)),
  ...([...Array(35).keys()].map(i => `3-${i + 1}`))
];
