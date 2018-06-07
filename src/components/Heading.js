import React from 'react';

const Heading = (props) => (
  <header className="Heading">
    <span className="Heading__title">{props.children}</span>
  </header>
);

export default Heading;
