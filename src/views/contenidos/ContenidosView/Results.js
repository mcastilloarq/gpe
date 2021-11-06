import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Link,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const Results = ({ ambitos, objetivos }) => {

  const objetivosPorAmbito = (ambito) => {
    return objetivos ? objetivos.filter(obj => obj.ambito === ambito) : [];
  };

  return (
    <List>
      {Object.keys(ambitos).map((ambito) => (
        <Box key={ambito}>
          <ListItem>
            <ListItemText primary={ambitos[ambito]} />
          </ListItem>
          <Box ml={2}>
            <List>
              {objetivosPorAmbito(ambito).map(objectivo => {
                const link = `/app/objetivo/${objectivo.id}`;
                return (
                  <ListItem key={objectivo.id}>
                    <Link
                      color="inherit"
                      component={RouterLink}
                      to={link}
                      underline="none"
                      variant="h5"
                    >
                      {objectivo.nombre}
                    </Link>
                  </ListItem>
                )
              })}
            </List>
          </Box>
        </Box>
      ))}
    </List>
  );
};

Results.propTypes = {
  className: PropTypes.string
};

export default Results;
