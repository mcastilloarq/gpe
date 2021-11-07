import React, { useState, useEffect } from 'react';
import { makeStyles, Box } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Checkbox from "@material-ui/core/Checkbox";
import { colors } from '@material-ui/core';
import { save } from 'src/services/firebaseDB';
import { AMBITOS } from 'src/constants/data';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 800,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: 'none'
  },
  form: {
    marginTop: 20
  },
  cardActions: {
    float: 'right'
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  nameInput: {
    width: '100%'
  },
  pinSection: {
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  pinInput: {
    width: '50%',
  },
  generatePin: {
    marginLeft: '20px'
  },
  hint: {
    marginLeft: '20px',
    color: colors.grey[400]
  },
  competencia: {
    textTransform: 'uppercase',
    color: colors.grey[400],
    fontSize: '1.2em',
    marginBottom: 10
  },
  objetivo : {
    color: colors.grey[900],
    fontSize: '1.2em',
    marginLeft: 10
  },
  indicadoresContainer: {
    height: 500,
    overflow: 'scroll'
  },
  indicador: {
    marginLeft: 10
  }
}));

export default function SimpleModal({ item, openDialog, onSave, onClose, clientId, options }) {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [indicadores, setIndicadores] = useState(options.indicadores);
  const [objetivos, setObjetivos] = useState(options.objetivos);

  const [values, setValues] = useState({});

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (item.id) {
      save({collection: `clients/${clientId}/programas`, docName: item.id, item: values}).then(() => {
        onSave(item.id);
      });
    } else {
      save({collection: `clients/${clientId}/programas`, item: values}).then((response) => {
        onSave(response.id);
      });
    }
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleChangeIndicador = (event) => {
    const prevIndicadores = values.indicadores;
    if (prevIndicadores.includes(event.target.name) && !event.target.checked) {
      prevIndicadores.splice(prevIndicadores.indexOf(event.target.name), 1);
    } else if (!prevIndicadores.includes(event.target.name) && event.target.checked) {
      prevIndicadores.push(event.target.name);
    }
    setValues({
      ...values,
      indicadores: prevIndicadores
    });
  };

  useEffect(() => {
    setValues({
      nombre: item.nombre ? item.nombre : '',
      titulo: item.titulo ? item.titulo : '',
      indicadores: item.indicadores ? item.indicadores : [],
      createdAt: item.createdAt ? item.createdAt : (new Date().getTime())
    });
    setIndicadores(options.indicadores);
    setObjetivos(options.objetivos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <Card className={classes.root}>
        <CardContent>
          <Typography component="h5" variant="h5" mb={5}>
            {item.id ? 'Editar programa específico': 'Nuevo programa específico'}
          </Typography>
          <Divider />
          <form className={classes.form} noValidate autoComplete="off">
            <Box>
              <TextField
                name="nombre"
                value={values.nombre}
                onChange={handleChange}
                className={classes.nameInput}
                label="Nombre"
                variant="outlined"
                required
                autoFocus
              />
            </Box>
            <Box mt={2}>
              <TextField
                name="titulo"
                value={values.titulo}
                onChange={handleChange}
                className={classes.nameInput}
                label="Título"
                variant="outlined"
                required
              />
            </Box>

            <Box mt={3}>
              <Typography component="h5" variant="h5" color="textSecondary" mb={5}>
                {'Indicadores'}
              </Typography>
              <Divider />
              <Box className={classes.indicadoresContainer}>
                {Object.keys(AMBITOS).map(ambito => (
                  <Box key={ambito} mt={2}>
                    <Typography variant="h4" mb={5} className={classes.competencia}>
                      {AMBITOS[ambito]}
                    </Typography>
                    {objetivos?.filter(o => o.ambito === ambito).map(objetivo => (
                      <Box key={objetivo.id} mb={1}>
                        <Typography variant="h4" mb={5} className={classes.objetivo}>
                          {objetivo.nombre}
                        </Typography>
                          {indicadores.filter(i => i.objetivoId === objetivo.id).map((indicador, i) => (
                            <Box key={i} display={'flex'} alignItems="center" className={classes.indicador}>
                              <Checkbox
                                name={indicador.id}
                                checked={values.indicadores?.includes(indicador.id)}
                                onChange={handleChangeIndicador}
                                inputProps={{ "aria-label": "primary checkbox" }}
                              />
                              <Typography variant="body1" mb={5}>
                                {indicador.nombre}
                              </Typography>
                            </Box>
                          ))}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>

          </form>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Button
            type='submit'
            size="small" 
            color="primary"
            variant="contained"
            onClick={handleSave}
            disabled={!values.nombre || !values.titulo}
          >Guardar</Button>
        </CardActions>
      </Card>
    </div>
  );

  return (
    <Modal
      open={openDialog}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  );
}
