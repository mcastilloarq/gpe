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
import { colors } from '@material-ui/core';
import { save } from 'src/services/firebaseDB';

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
    width: 600,
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
  }
}));

export default function SimpleModal({ item, openDialog, onSave, onClose, clientId, options }) {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [values, setValues] = useState({});

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (item.id) {
      save({collection: `clients/${clientId}/indicadores`, docName: item.id, item: values}).then(() => {
        onSave();
      });
    } else {
      save({collection: `clients/${clientId}/indicadores`, item: values}).then((response) => {
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

  useEffect(() => {
    setValues({
      nombre: item.nombre ? item.nombre : '',
      contenido: item.contenido ? item.contenido : '',
      actividades: item.actividades ? item.actividades : '',
      objetivoId: options.objetivoId,
      createdAt: item.createdAt ? item.createdAt : (new Date().getTime())
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <Card className={classes.root}>
        <CardContent>
          <Typography component="h5" variant="h5" mb={5}>
            {item.id ? 'Editar indicador': 'Nuevo indicador'}
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
                fullWidth
                label="Contenido"
                name="contenido"
                onChange={handleChange}
                required
                multiline
                value={values.contenido}
                variant="outlined"
                rows={10}
              />
            </Box>
            <Box mt={2}>
              <TextField
                fullWidth
                label="Actividades"
                name="actividades"
                onChange={handleChange}
                required
                multiline
                value={values.actividades}
                variant="outlined"
                rows={10}
              />
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
            disabled={!values.nombre}
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
