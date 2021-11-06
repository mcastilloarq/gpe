import React, { useState } from 'react';
import {
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton,
  makeStyles,
  colors
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(() => ({
  email: {
    marginBottom: 10
  },
  deleteOption: {
    color: colors.red[600]
  }
}));

const ProfeOptions = ({ profe, openProfeDialog, openDeleteProfeDialog, ...rest }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const openOptions = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeOptions = () => {
    setAnchorEl(null);
  };

  const openEditProfeDialog = () => {
    closeOptions();
    openProfeDialog(profe);
  };

  const handleOpenDeleteProfeDialog = () => {
    closeOptions();
    openDeleteProfeDialog(profe);
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
          <MenuItem
            onClick={openEditProfeDialog}
          >
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            Editar usuario
          </MenuItem>
          <MenuItem
            className={classes.deleteOption}
            onClick={handleOpenDeleteProfeDialog}
          >
            <ListItemIcon
              className={classes.deleteOption}
            >
              <DeleteIcon />
            </ListItemIcon>
            Eliminar usuario
          </MenuItem>
        </Box>
      </Menu>
    </div>
  );
};

export default ProfeOptions;

