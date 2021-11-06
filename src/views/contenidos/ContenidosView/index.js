import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import firebase from 'firebase/app';
import { useNavigate } from 'react-router-dom';
import { list } from 'src/services/firebaseDB';
import CRUDDialog from './CRUDDialog';

import { AMBITOS } from 'src/constants/data';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const ContenidosView = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [clientId, setClientId] = useState();
  const [openObjectivoDialog, setOpenObjectivoDialog] = useState(false);
  const [objetivos, setObjetivos] = useState([]);

  
  const [filteredUsers, setFilteredUsers] = useState([]);


  const populateObjetivos = async (id = clientId) => {
    const objetivos = await list(`clients/${id}/objetivos`, 'createdAt');
    setObjetivos(objetivos);
  };

  const filterUsers = (query) => {
    // const regex = new RegExp(query);
    // const result = profes.filter(p => p.name.match(regex));
    // setFilteredUsers(result);
  };

  const handleSaveObjectivo = (objetivoId) => {
    navigate(`/app/objetivo/${objetivoId}`, { replace: true });
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser?.emailVerified) {
        setClientId(firebaseUser.uid);
        populateObjetivos(firebaseUser.uid);
      } else {
        navigate('/app/home', { replace: true });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page
      className={classes.root}
      title="GPE - Contenidos"
    >
      <Container maxWidth={false}>
        <Toolbar
          filterUsers={filterUsers}
          profes={filteredUsers}
          setOpenObjectivoDialog={setOpenObjectivoDialog}
        />
        <Box mt={3}>
          <Results
            ambitos={AMBITOS}
            objetivos={objetivos}
          />
        </Box>
      </Container>
      <CRUDDialog
        item={{}}
        openDialog={openObjectivoDialog}
        onClose={() => setOpenObjectivoDialog(false)}
        onSave={handleSaveObjectivo}
        clientId={clientId}
        options={null}
      />
    </Page>
  );
};

export default ContenidosView;
