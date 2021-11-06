import React, { useState } from 'react';
import {
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton,
  makeStyles
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import BlockIcon from '@material-ui/icons/Block';
import CheckIcon from '@material-ui/icons/Check';
import ReplayIcon from '@material-ui/icons/Replay';
import { save } from 'src/services/firebaseDB';

const useStyles = makeStyles(() => ({
  email: {
    marginBottom: 10
  }
}));

const ClientOptions = (props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const openOptions = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeOptions = () => {
    setAnchorEl(null);
  };

  const disableClient = () => {
    const params = {
      collection: 'clients',
      docName: props.client.id,
      item: {status: 'disabled'}
    };
    setAnchorEl(null);
    save(params).then(() => {
      props.onUpdateClient();
    });
  };

  const enableClient = () => {
    const params = {
      collection: 'clients',
      docName: props.client.id,
      item: {status: 'paid'}
    };
    setAnchorEl(null);
    save(params).then(() => {
      props.onUpdateClient();
    });
  };

  const reloadTrial = () => {
    const params = {
      collection: 'clients',
      docName: props.client.id,
      item: {
        status: 'trial',
        registrationDate: new Date().getTime()
      }
    };
    setAnchorEl(null);
    save(params).then(() => {
      props.onUpdateClient();
    });
  };

  return (
    <div>
      <IconButton aria-label="delete"
        className={classes.margin}
        onClick={openOptions}
      >
        <MoreHorizIcon fontSize="small" />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeOptions}
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
          alignItems="left"
          display="flex"
          flexDirection="column"
          p={2}
        >
          {props.client.status !== 'disabled'
            ?
            <MenuItem
              onClick={disableClient}
            >
              <ListItemIcon>
                <BlockIcon />
              </ListItemIcon>
              Disable client
            </MenuItem>
            :
            <MenuItem
              onClick={enableClient}
            >
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
              Enable client
            </MenuItem>
          }
          {props.client.status !== 'trial' ?
            <MenuItem
              onClick={reloadTrial}
            >
              <ListItemIcon>
                <ReplayIcon />
              </ListItemIcon>
              Reload trial
            </MenuItem>
            :
            <MenuItem
              onClick={enableClient}
            >
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
              Enable client
            </MenuItem>
          }
        </Box>
      </Menu>
    </div>
  );
};

export default ClientOptions;

