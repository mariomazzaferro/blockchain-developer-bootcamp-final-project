import React from 'react';

const Header = ({green, victor}) => {

  return (
    <header>
      <h1>{green ? 'Green!' : 'Red...'}</h1>
      <h2>Victor: {victor}</h2>
    </header>
  )
};

export default Header;