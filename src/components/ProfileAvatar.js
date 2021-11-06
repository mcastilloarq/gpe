import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton,
  Typography,
  makeStyles
} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import { LogOut as LogOutIcon } from 'react-feather';
import { signOut } from 'src/services/firebaseFunctions';
import { onAuthStateChanged } from 'src/services/firebaseFunctions';

const useStyles = makeStyles(() => ({
  email: {
    marginBottom: 10
  }
}));

const ProfileAvatar = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    let isMounted = true;

    onAuthStateChanged((firebaseUser) => {
      if (isMounted) {
        setIsAuthenticated(!!firebaseUser);
        if (!!firebaseUser) {
          setUser({
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            avatar: firebaseUser.photoURL
          });
        }
      }
    })

    return () => { isMounted = false };
  }, [location.pathname]);

  const openProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeProfileMenu = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    signOut();
    navigate('/app/home', { replace: true });
  };

  const profileAvatar = (
    <div>
      <Avatar
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={openProfileMenu}
        className='small'
        src={user.avatar}
      >
      </Avatar>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeProfileMenu}
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          p={2}
        >
          <Typography
            className={classes.email}
            color="textSecondary"
            variant="h5"
          >
            {user.email}
          </Typography>
          <MenuItem
            onClick={logout}
          >
            <ListItemIcon>
              <LogOutIcon />
            </ListItemIcon>
            Cerrar sesión
          </MenuItem>
        </Box>
      </Menu>
    </div>
  )

  if (isAuthenticated) {
    return profileAvatar
  } else {
    return (
      <IconButton
        href="/login"
        color="inherit"
      >
        <LockIcon />
      </IconButton>
    )
  }
};

export default ProfileAvatar;

