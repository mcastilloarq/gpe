import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Link,
  List,
  ListItem
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const Results = ({ programas }) => {

  return (
    <List>
      <Box>
        <List>
          {programas?.map(programa => {
            const link = `/app/programa/${programa.id}`;
            return (
              <ListItem key={programa.id}>
                <Link
                  color="inherit"
                  component={RouterLink}
                  to={link}
                  underline="none"
                  variant="h5"
                >
                  {programa.nombre}
                </Link>
              </ListItem>
            )
          })}
        </List>
      </Box>
    </List>
  );
};

Results.propTypes = {
  className: PropTypes.string
};

export default Results;
