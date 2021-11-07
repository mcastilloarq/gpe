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
  const [openProgramaDialog, setOpenProgramaDialog] = useState(false);
  const [objetivos, setObjetivos] = useState([]);
  const [indicadores, setIndicadores] = useState([]);
  const [programas, setProgramas] = useState([]);

  
  const [filteredResults, setFilteredResults] = useState([]);


  const populateObjetivos = async (id = clientId) => {
    const objetivos = await list(`clients/${id}/objetivos`, 'createdAt');
    setObjetivos(objetivos);
  };

  const populateIndicadores = async (id = clientId) => {
    const indicadores = await list(`clients/${id}/indicadores`, 'createdAt');
    setIndicadores(indicadores);
  };
  
  const populateProgramas = async (id = clientId) => {
    const programas = await list(`clients/${id}/programas`, 'createdAt');
    setProgramas(programas);
    setFilteredResults(programas);
  };

  const filterResults = (query) => {
    const regex = new RegExp(query);
    const result = programas.filter(p => p.nombre.match(regex));
    setFilteredResults(result);
  };

  const handleSavePrograma = (programaId) => {
    setOpenProgramaDialog(false)
    navigate(`/app/programa/${programaId}`, { replace: true });
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser?.emailVerified) {
        setClientId(firebaseUser.uid);
        populateObjetivos(firebaseUser.uid);
        populateIndicadores(firebaseUser.uid);
        populateProgramas(firebaseUser.uid);
      } else {
        navigate('/app/home', { replace: true });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page
      className={classes.root}
      title="GPE - Programas específicos"
    >
      <Container maxWidth={false}>
        <Toolbar
          filterResults={filterResults}
          setOpenProgramaDialog={setOpenProgramaDialog}
        />
        <Box mt={3}>
          <Results
            ambitos={AMBITOS}
            programas={filteredResults}
          />
        </Box>
      </Container>
      <CRUDDialog
        item={{}}
        openDialog={openProgramaDialog}
        onClose={() => setOpenProgramaDialog(false)}
        onSave={handleSavePrograma}
        clientId={clientId}
        options={{
          indicadores,
          objetivos
        }}
      />
    </Page>
  );
};

export default ContenidosView;
