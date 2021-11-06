import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Button,
  ListItem,
  IconButton,
  makeStyles
} from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const useStyles = makeStyles((theme) => ({
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: 'flex-start',
    letterSpacing: 0,
    padding: '10px 8px',
    textTransform: 'none',
    width: '100%'
  },
  icon: {
    marginRight: theme.spacing(1)
  },
  title: {
    marginRight: 'auto'
  },
  active: {
    color: theme.palette.primary.main,
    '& $title': {
      fontWeight: theme.typography.fontWeightMedium
    },
    '& $icon': {
      color: theme.palette.primary.main
    }
  }
}));

const NavItem = ({
  className,
  href,
  icon: Icon,
  title,
  blank,
  target,
  ...rest
}) => {
  const classes = useStyles();

  const openTarget = (e) => {
    e.preventDefault();
    window.open(target, "_blank", "toolbar=no,top=200,left=200,width=600,height=700")
  };

  return (
    <ListItem
      className={clsx(classes.item, className)}
      disableGutters
      {...rest}
    >
      <Button
        className={classes.button}
        component={RouterLink}
        to={href}
      >
        {Icon && (
          <Icon
            className={classes.icon}
            size="20"
          />
        )}
        <span className={classes.title}>
          {title}
        </span>
        {blank && (
          <IconButton
            color="inherit"
            onClick={(e) => openTarget(e)}
          >
            <OpenInNewIcon />
          </IconButton>
        )}
      </Button>
    </ListItem>
  );
};

NavItem.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string,
  blank: PropTypes.bool,
  target: PropTypes.string
};

export default NavItem;
