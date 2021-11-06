import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Logo from 'src/components/Logo';
import ProfileAvatar from 'src/components/ProfileAvatar';
import firebase from 'firebase/app';

const useStyles = makeStyles(() => ({
  root: {},
  warn: {
    color: 'orange',
    marginLeft: '2rem'
  },
  warnLink: {
    color: 'white'
  }
}));

const TopBar = ({
  className,
  onMobileNavOpen,
  ...rest
}) => {
  const classes = useStyles();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (firebaseUser) => {
      if(!!firebaseUser) {
      }
    });
  }, []);

  return (
    <AppBar
      className={clsx(classes.root, className)}
      elevation={0}
      {...rest}
    >
      <Toolbar>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
        <Box flexGrow={1} display='flex' justifyContent='flex-end' mr={10}>
          <form action="https://www.paypal.com/donate" method="post" target="_blank">
            <input type="hidden" name="business" value="94WWUJ5NXKBJS" />
            <input type="hidden" name="no_recurring" value="1" />
            <input type="hidden" name="currency_code" value="EUR" />
            <input type="image" src="https://www.paypalobjects.com/es_ES/ES/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Botón Donar con PayPal" />
            <img alt="" border="0" src="https://www.paypal.com/es_ES/i/scr/pixel.gif" width="1" height="1" />
          </form>
        </Box>
        <Hidden mdDown>
          <ProfileAvatar />
        </Hidden>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

export default TopBar;
