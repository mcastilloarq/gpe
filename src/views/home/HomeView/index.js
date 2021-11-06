import React, { useState, useEffect } from 'react';
import {
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Step1 from './Step1';
import firebase from 'firebase/app';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Home = () => {
  const classes = useStyles();

  const [registeredUser, setRegisteredUser] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser?.emailVerified) {
        setRegisteredUser(true);
      }
    });
  }, []);

  return (
    <Page
      className={classes.root}
      title="GPE - Home"
    >
      <Container maxWidth={false}>
        <Step1 registeredUser={registeredUser} />
      </Container>
    </Page>
  );
};

export default Home;
