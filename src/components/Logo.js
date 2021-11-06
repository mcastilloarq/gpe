import React from 'react';

const Logo = (props) => {
  return (
    <img
      alt="Logo"
      width='42'
      height='42'
      src="/static/logo.png"
      {...props}
    />
  );
};

export default Logo;
