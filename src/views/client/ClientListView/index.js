import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import firebase from 'firebase/app';
import { getCurrentUser } from 'src/services/firebaseFunctions';
import { useNavigate } from 'react-router-dom';
import { list } from 'src/services/firebaseDB';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CustomerListView = () => {
  const classes = useStyles();
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  const populateClients = async () => {
    const clients = await list('clients');
    if (clients) {
      setCustomers(clients);
    }
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        getCurrentUser(firebaseUser.uid).then((user) => {
          if (user?.role === 'superadmin') {
            populateClients();
          } else {
            navigate('/app/home', { replace: true });
          }
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page
      className={classes.root}
      title="Customers"
    >
      <Container maxWidth={false}>
        <Toolbar />
        <Box mt={3}>
          <Results customers={customers} onUpdateClient={populateClients} />
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
