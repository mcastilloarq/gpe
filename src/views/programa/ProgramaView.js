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
import ProgramaDialog from '../programas/ProgramasView/CRUDDialog';
import DeleteProgramaDialog from './DeleteProgramaDialog';
import CopyContent from './CopyContent';
import { colors } from '@material-ui/core';
import { jsPDF } from "jspdf";

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

const ProgramaView = () => {
  const classes = useStyles();
  const { programaId } = useParams();
  const navigate = useNavigate();
  const [clientId, setClientId] = useState();
  const [programa, setPrograma] = useState();
  const [indicadores, setIndicadores] = useState();
  const [objetivos, setObjetivos] = useState();
  const [currentObjetivos, setCurrentObjetivos] = useState([]);
  const [openProgramaDialog, setOpenProgramaDialog] = useState(false);
  const [openDeleteProgramaDialog, setOpenDeleteProgramaDialog] = useState(false);
  const [paperClip, setPaperClip] = useState();

  const getPrograma = async (clientId, programaId) => {
    const params = {
      collection: `clients/${clientId}/programas`,
      docName: programaId,
    }
    const programa = await get(params);
    setPrograma({...programa, id: programaId});

    return programa;
  };

  const populateIndicadores = async (clientId) => {
    const indicadores = await list(`clients/${clientId}/indicadores`, 'createdAt');
    setIndicadores(indicadores);

    return indicadores;
  };

  const populateObjetivos = async (clientId) => {
    const objetivos = await list(`clients/${clientId}/objetivos`, 'createdAt');
    const orderedObjetivos = [];

    Object.keys(AMBITOS).forEach(ambito => {
      objetivos.forEach(objetivo => {
        if (objetivo.ambito === ambito) orderedObjetivos.push(objetivo);
      });
    });

    setObjetivos(orderedObjetivos);
    
    return orderedObjetivos;
  };

  const populateCurrentObjetivos = (programa, objetivos, indicadores) => {
    const result = objetivos.filter(o => {
      return programa.indicadores.some(i => {
        const indicador = indicadores.find(ind => ind.id === i);
        return indicador?.objetivoId === o.id;
      });
    });

    setCurrentObjetivos(result);
  };

  const deletePrograma = () => {
    setOpenDeleteProgramaDialog(true);
  };

  const handleDeletePrograma = () => {
    setOpenDeleteProgramaDialog(false);
    navigate('/app/programas', { replace: true });
  };

  const handleCloseDeleteProgramaDialog = () => {
    setOpenDeleteProgramaDialog(false);
  };

  const editPrograma = () => {
    setOpenProgramaDialog(true);
  };

  const handleSavePrograma = (programaId) => {
    getPrograma(clientId, programaId);
    setOpenProgramaDialog(false);
  };

  const indicadoresPerObjetivo = (objetivo) => {
    return indicadores.filter(ind => ind.objetivoId === objetivo.id && programa.indicadores.includes(ind.id))
  };

  const copyContent = (content) => {
    setPaperClip(content);
  };

  const exportarPdf = () => {
    const doc = new jsPDF();

    let currentLine = 0;
    const moveCurrentLine = (lines) =>{
      currentLine += lines;
      if (currentLine >= 280) {
        doc.addPage();
        currentLine = 20;
      }
      return currentLine;
    };

    const writeObjetivos = () => {
      currentObjetivos.forEach((objetivo, i) => {
        doc.text(`${i+1}.- ${objetivo.nombre}`, 20, moveCurrentLine(6));
      });
    };

    const writeCompetencias = (objetivo) => {
      doc.text('COMPETENCIAS:', 20, moveCurrentLine(10));
      Object.keys(COMPETENCIAS).forEach(key => {
        if (objetivo.competencias[key]) {
          doc.text(COMPETENCIAS[key], 20, moveCurrentLine(6));
        }
      })
    };

    const writeMultiLine = (text) => {
      const textLines = doc.splitTextToSize(text, 160);
      doc.text(textLines, 20, moveCurrentLine(6));
      const lines = textLines.length;
      moveCurrentLine(lines * 3);
    };

    const writeIndicadores = () => {
      currentObjetivos.forEach((objetivo, iObjetivo) => {
        indicadoresPerObjetivo(objetivo).forEach((indicador, iIndicador) => {
          doc.text(`${iObjetivo+1}.${iIndicador+1}.- ${indicador.nombre}`, 20, moveCurrentLine(10));
          doc.text('CONTENIDO:', 20, moveCurrentLine(6));
          writeMultiLine(indicador.contenido);
          doc.text('ACTIVIDADES:', 20, moveCurrentLine(6));
          writeMultiLine(indicador.actividades);
        });
        writeCompetencias(objetivo);
      });
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(programa.titulo, 20, moveCurrentLine(20));
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('OBJETIVOS:', 20, moveCurrentLine(12));
    writeObjetivos();
    doc.text('INDICADORES, ACTIVIDADES, CONTENIDOS Y COMPETENCIAS', 20, moveCurrentLine(12));
    writeIndicadores();
    // doc.text(insertBlankLine(nombres), 10, 15);
    // doc.text(insertBlankLine(data), 50, 15);
    doc.save(`programa específico ${programa.nombre}.pdf`);
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser?.emailVerified) {
        setClientId(firebaseUser.uid);
        const programa = await getPrograma(firebaseUser.uid, programaId);
        const indicadores = await populateIndicadores(firebaseUser.uid);
        const objetivos = await populateObjetivos(firebaseUser.uid);
        populateCurrentObjetivos(programa, objetivos, indicadores);
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
      <>
      {programa && indicadores && objetivos &&
        <Container maxWidth={false}>
          <Box
            display="flex"
            alignItems="flex-start"
            flexWrap="wrap"
          >
            <Box flexGrow={1}>
              <Typography
                color="textSecondary"
                variant="body1"
                className={classes.title}
              >
                {programa.nombre}
              </Typography>
            </Box>
            <Box display='flex'>
              <Box mr={2}>
                <IconButton aria-label="delete"
                  className={classes.deleteButton}
                  onClick={deletePrograma}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="delete"
                  className={classes.margin}
                  onClick={editPrograma}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
              <Button
                color="primary"
                variant="contained"
                onClick={exportarPdf}
              >
                Exportar PDF
              </Button>
            </Box>
          </Box>
          <Box display='flex' alignItems='baseline' width={800} mr={'auto'}>
            <CopyContent
              content={programa.titulo}
              paperClip={paperClip}
              onCopyContent={copyContent}
            />
            <Typography
              color="textPrimary"
              variant="h2"
              className={classes.title}
            >
              {programa.titulo}
            </Typography>
          </Box>
          <Box mb={1}>
            <Typography variant="h5" color="textSecondary" mb={5}>
              {`Objetivos: (${currentObjetivos.length})`}
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
              {currentObjetivos.map(objetivo => (
                <Box key={objetivo.id} mb={2}>
                  <Box display='flex' alignItems='center'>
                    <CopyContent
                      content={objetivo.nombre}
                      paperClip={paperClip}
                      onCopyContent={copyContent}
                    />
                    <Typography
                      color="textPrimary"
                      variant="h4"
                      className={classes.indicadorContent}
                    >
                      {objetivo.nombre}
                    </Typography>
                  </Box>
                  <Box mt={1}>
                    <Box mb={1}>
                      <Typography variant="h5" color="textSecondary">
                        {`Indicadores: (${indicadoresPerObjetivo(objetivo).length})`}
                      </Typography>
                    </Box>
                    {indicadoresPerObjetivo(objetivo).map(indicador => (
                      <Card
                      key={indicador.id}
                      className={classes.indicador}
                      >
                      <CardContent>
                        <Box
                          display="flex"
                          alignItems="flex-start"
                        >
                          <Box flexGrow='1' display='flex' alignItems='center'>
                            <CopyContent
                              content={indicador.nombre}
                              paperClip={paperClip}
                              onCopyContent={copyContent}
                            />
                            <Typography
                              color="textPrimary"
                              variant="h4"
                              className={classes.indicadorContent}
                            >
                              {indicador.nombre}
                            </Typography>
                          </Box>
                        </Box>
                        <Divider className={classes.divider} />
                        <Box
                          display="flex"
                          alignItems="flex-start"
                          flexWrap="wrap"
                        >
                          <Box width={150} display='flex' alignItems='flex-end'>
                            <CopyContent
                              content={indicador.contenido}
                              paperClip={paperClip}
                              onCopyContent={copyContent}
                            />
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
                          <Box width={150} display='flex' alignItems='flex-end'>
                            <CopyContent
                              content={indicador.actividades}
                              paperClip={paperClip}
                              onCopyContent={copyContent}
                            />
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
                  </Box>
                  <Box mt={2}>
                    <Box display='flex' alignItems='center' mb={1}>
                      <Typography variant="h5" color="textSecondary" mb={5}>
                        {'Competencias:'}
                      </Typography>
                    </Box>
                    {Object.keys(COMPETENCIAS).filter(key => objetivo.competencias[key]).map(key => (
                      <Typography variant="body1" mb={5} key={key}>
                        - {COMPETENCIAS[key]}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ))}
            </Grid>
          </Grid>
          <ProgramaDialog
            item={programa}
            openDialog={openProgramaDialog}
            onClose={() => setOpenProgramaDialog(false)}
            onSave={handleSavePrograma}
            clientId={clientId}
            options={{
              indicadores,
              objetivos
            }}
          />
          <DeleteProgramaDialog
            item={programa}
            openDialog={openDeleteProgramaDialog}
            onClose={handleCloseDeleteProgramaDialog}
            onDelete={handleDeletePrograma}
            clientId={clientId}
          />
        </Container>
      }
      {/* <IndicadorDialog
        item={currentIndicador}
        openDialog={openIndicadorDialog}
        onClose={handleCloseIndicadorDialog}
        onSave={handleSaveIndicador}
        clientId={clientId}
        options={{objetivoId}}
      /> */}
      </>
    </Page>
  );
};

export default ProgramaView;
