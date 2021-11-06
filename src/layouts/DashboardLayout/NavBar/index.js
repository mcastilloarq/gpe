import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { onAuthStateChanged, signOut, getCurrentUser } from 'src/services/firebaseFunctions';
import {
  Box,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Drawer,
  Hidden,
  List,
  makeStyles
} from '@material-ui/core';
import {
  Lock as LockIcon,
  Home as HomeIcon,
  UserPlus as UserPlusIcon,
  LogOut as LogOutIcon,
  FileText as FileTextIcon,
  List as ListIcon
} from 'react-feather';
import NavItem from './NavItem';

const items = [
  {
    href: '/app/home',
    icon: HomeIcon,
    title: 'Home'
  },
  {
    href: '/login',
    icon: LockIcon,
    title: 'Iniciar sesión'
  },
  {
    href: '/register',
    icon: UserPlusIcon,
    title: 'Crear cuenta'
  }
];

const adminItems = [
  {
    href: '/app/programas',
    icon: FileTextIcon,
    title: 'Programas específicos'
  },
  {
    href: '/app/contenidos',
    icon: ListIcon,
    title: 'Contenidos'
  }
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuItems, seMenuItems] = useState([]);

  const logout = () => {
    signOut();
    navigate('/app/home', { replace: true });
  };

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }

    let isMounted = true;

    onAuthStateChanged((firebaseUser) => {
      if (isMounted) {
        setIsAuthenticated(!!firebaseUser);
        if (firebaseUser) {
          getCurrentUser(firebaseUser.uid).then((user) => {
            seMenuItems(adminItems);
          });
        } else {
          seMenuItems(items);
        }
      }
    })

    return () => { isMounted = false };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box p={2}>
        <List>
          {menuItems.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
              blank={item.blank}
              target={item.target}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
      {isAuthenticated &&
        <div>
          <Divider />
          <ListItem
            button
            onClick={logout}
          >
            <ListItemIcon>
              <LogOutIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" />
          </ListItem>
        </div>
      }
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
