import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';

const useStyles = makeStyles((theme) => ({
  root: {},
  search: {
    flexGrow: '1'
  },
  timeNavigationButton: {
    marginRight: theme.spacing(1)
  },
  monthName: {
    width: '5em',
    display: 'inline-flex',
    justifyContent: 'center'
  }
}));

const Toolbar = ({ className, filterUsers, setOpenObjectivoDialog, ...rest }) => {
  const classes = useStyles();

  const handleOnChange = (e) => {
    filterUsers(e.target.value);
  };

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap"
      >
        <Box width={500} mr={'auto'}>
          <TextField
            onChange={handleOnChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon
                    fontSize="small"
                    color="action"
                  >
                    <SearchIcon />
                  </SvgIcon>
                </InputAdornment>
              )
            }}
            placeholder="Buscar objetivo"
            variant="outlined"
          />
        </Box>
        <Box>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setOpenObjectivoDialog(true)}
          >
            Crear objetivo
          </Button>
        </Box>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
