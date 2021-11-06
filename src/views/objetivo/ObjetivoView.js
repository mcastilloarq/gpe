import React, { useState, useEffect } from 'react';
import {
  Grid,
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
  IconButton,
  makeStyles
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Page from 'src/components/Page';
import { useParams, useNavigate } from "react-router-dom";
import { get, list } from 'src/services/firebaseDB';
import firebase from 'firebase/app';
import { AMBITOS } from 'src/constants/data';
import { COMPETENCIAS } from 'src/constants/data';
import IndicadorDialog from './CRUDDialog';
import ObjetivoDialog from '../contenidos/ContenidosView/CRUDDialog';
import DeleteIndicadorDialog from './DeleteIndicadorDialog';
import DeleteObjetivoDialog from './DeleteObjetivoDialog';
import { colors } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  topBar: {
    height: '64px'
  },
  title: {
    marginBottom: 20
  },
  ambito: {
    marginBottom: 10
  },
  indicador: {
    marginBottom: 10
  },
  indicadorContent: {
    whiteSpace: 'pre-wrap'
  },
  divider: {
    marginTop: 10,
    marginBottom: 10
  },
  deleteButton: {
    color: colors.red[600]
  }
}));

const ObjetivoView = () => {
  const classes = useStyles();
  const { objetivoId } = useParams();
  const navigate = useNavigate();
  const [clientId, setClientId] = useState();
  const [objetivo, setObjetivo] = useState();
  const [indicadores, setIndicadores] = useState();
  const [openObjectivoDialog, setOpenObjectivoDialog] = useState(false);
  const [openIndicadorDialog, setOpenIndicadorDialog] = useState(false);
  const [currentIndicador, setCurrentIndicador] = useState({});
  const [openDeleteIndicadorDialog, setOpenDeleteIndicadorDialog] = useState(false);
  const [openDeleteObjetivoDialog, setOpenDeleteObjetivoDialog] = useState(false);

  const getObjetivo = async (clientId, objetivoId) => {
    const params = {
      collection: `clients/${clientId}/objetivos`,
      docName: objetivoId,
    }
    const objetivo = await get(params);
    setObjetivo({...objetivo, id: objetivoId});
  };

  const populateIndicadores = async (clientId, objetivoId) => {
    const indicadores = await list(`clients/${clientId}/indicadores`, 'createdAt');
    setIndicadores(indicadores.filter(indicador => indicador.objetivoId === objetivoId));
  };

  const handleSaveIndicador = () => {
    setOpenIndicadorDialog(false);
    setCurrentIndicador({});
    populateIndicadores(clientId, objetivoId);
  };

  const handleCloseIndicadorDialog = () => {
    setOpenIndicadorDialog(false);
    setCurrentIndicador({});
  };

  const editIndicador = (indicador) => {
    setCurrentIndicador(indicador);
    setOpenIndicadorDialog(true);
  };

  const deleteIndicador = (indicador) => {
    setCurrentIndicador(indicador);
    setOpenDeleteIndicadorDialog(true);
  };

  const handleDeleteIndicador = () => {
    setOpenDeleteIndicadorDialog(false);
    setCurrentIndicador({});
    populateIndicadores(clientId, objetivoId);
  };

  const handleCloseDeleteIndicadorDialog = () => {
    setOpenDeleteIndicadorDialog(false);
    setCurrentIndicador({});
  };

  const deleteObjetivo = () => {
    setOpenDeleteObjetivoDialog(true);
  };

  const handleDeleteObjetivo = () => {
    setOpenDeleteObjetivoDialog(false);
    navigate('/app/contenidos', { replace: true });
  };

  const handleCloseDeleteObjetivoDialog = () => {
    setOpenDeleteObjetivoDialog(false);
  };

  const editObjetivo = () => {
    setOpenObjectivoDialog(true)
  };

  const handleSaveObjectivo = (objetivoId) => {
    getObjetivo(clientId, objetivoId);
    setOpenObjectivoDialog(false);
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser?.emailVerified) {
        setClientId(firebaseUser.uid);
        await getObjetivo(firebaseUser.uid, objetivoId);
        populateIndicadores(firebaseUser.uid, objetivoId);
      } else {
        navigate('/app/home', { replace: true });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page
      className={classes.root}
      title="GPE - Objetivo"
    >
      {objetivo &&
        <Container maxWidth={false}>
          <Box
            display="flex"
            alignItems="flex-start"
            flexWrap="wrap"
          >
            <Box width={800} mr={'auto'}>
              <Typography
                color="textSecondary"
                variant="h6"
                className={classes.ambito}
              >
                {`Ámbito: ${AMBITOS[objetivo.ambito]}`}
              </Typography>
              <Typography
                color="textPrimary"
                variant="h2"
                className={classes.title}
              >
                {objetivo.nombre}
              </Typography>
              <Box width={800} mb={3}>
                <Box mb={1}>
                  <Typography variant="h5" color="textSecondary" mb={5}>
                    {'Competencias:'}
                  </Typography>
                </Box>
                {Object.keys(objetivo.competencias)
                .filter(key => (objetivo.competencias[key]))
                .map(key => (
                  <Typography variant="body1" mb={5} key={key}>
                    - {COMPETENCIAS[key]}
                  </Typography>
                ))}
              </Box>
            </Box>
            <Box display='flex'>
              <Box mr={2}>
                <IconButton aria-label="delete"
                  className={classes.deleteButton}
                  onClick={deleteObjetivo}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="delete"
                  className={classes.margin}
                  onClick={editObjetivo}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
              <Button
                color="primary"
                variant="contained"
                onClick={() => setOpenIndicadorDialog(true)}
              >
                Crear indicador
              </Button>
            </Box>
          </Box>
          <Box mb={1}>
            <Typography variant="h5" color="textSecondary" mb={5}>
              {'Indicadores:'}
            </Typography>
          </Box>
          <Grid
            container
            justifyContent='center'
          >
            <Grid
              item
              lg={12}
              sm={12}
              xl={6}
              xs={12}
            >
              {indicadores?.map(indicador => (
                <Card
                  key={indicador.id}
                  className={classes.indicador}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="flex-start"
                    >
                      <Box flexGrow='1'>
                        <Typography
                          color="textPrimary"
                          variant="h4"
                          className={classes.indicadorContent}
                        >
                          {indicador.nombre}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton aria-label="delete"
                          className={classes.deleteButton}
                          onClick={() => deleteIndicador(indicador)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton aria-label="delete"
                          className={classes.margin}
                          onClick={() => editIndicador(indicador)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Divider className={classes.divider} />
                    <Box
                      display="flex"
                      alignItems="flex-start"
                      flexWrap="wrap"
                    >
                      <Box width={150}>
                        <Typography
                          color="textSecondary"
                          variant="h5"
                          className={classes.ambito}
                        >
                          {'Contenido'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          color="textPrimary"
                          variant="body1"
                          className={classes.indicadorContent}
                        >
                          {indicador.contenido}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider className={classes.divider} />
                    <Box
                      display="flex"
                      alignItems="flex-start"
                      flexWrap="wrap"
                    >
                      <Box width={150}>
                        <Typography
                          color="textSecondary"
                          variant="h5"
                          className={classes.ambito}
                        >
                          {'Actividades'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          color="textPrimary"
                          variant="body1"
                          className={classes.indicadorContent}
                        >
                          {indicador.actividades}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </Grid>
          <ObjetivoDialog
            item={objetivo}
            openDialog={openObjectivoDialog}
            onClose={() => setOpenObjectivoDialog(false)}
            onSave={handleSaveObjectivo}
            clientId={clientId}
            options={null}
          />
          <DeleteObjetivoDialog
            item={objetivo}
            openDialog={openDeleteObjetivoDialog}
            onClose={handleCloseDeleteObjetivoDialog}
            onDelete={handleDeleteObjetivo}
            clientId={clientId}
            indicadores={indicadores}
          />
        </Container>
      }
      <IndicadorDialog
        item={currentIndicador}
        openDialog={openIndicadorDialog}
        onClose={handleCloseIndicadorDialog}
        onSave={handleSaveIndicador}
        clientId={clientId}
        options={{objetivoId}}
      />
      <DeleteIndicadorDialog
        item={currentIndicador}
        openDialog={openDeleteIndicadorDialog}
        onClose={handleCloseDeleteIndicadorDialog}
        onDelete={handleDeleteIndicador}
        clientId={clientId}
      />
    </Page>
  );
};

export default ObjetivoView;
