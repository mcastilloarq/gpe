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
import { COMPETENCIAS } from 'src/constants/data';

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
  }
}));

const defaultCompetencias = () => {
  const result = {};
  Object.keys(COMPETENCIAS).forEach(competencia => {
    result[competencia] = false;
  })
  return result;
};

export default function SimpleModal({ item, openDialog, onSave, onClose, clientId, options }) {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [values, setValues] = useState({
    nombre: item.nombre ? item.nombre : '',
    ambito: item.ambito ? item.ambito : 'otro',
    competencias: item.competencias ? item.competencias : defaultCompetencias(),
    createdAt: item.createdAt ? item.createdAt : (new Date().getTime())
  });

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (item.id) {
      save({collection: `clients/${clientId}/objetivos`, docName: item.id, item: values}).then(() => {
        onSave(item.id);
      });
    } else {
      save({collection: `clients/${clientId}/objetivos`, item: values}).then((response) => {
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

  const handleChangeCompetencias = (event) => {
    setValues({
      ...values,
      competencias: {
        ...values.competencias,
        [event.target.name]: event.target.checked
      }
    });
  };

  useEffect(() => {
    setValues({
      nombre: item.nombre ? item.nombre : '',
      ambito: item.ambito ? item.ambito : 'otro',
      competencias: item.competencias ? item.competencias : defaultCompetencias(),
      createdAt: item.createdAt ? item.createdAt : (new Date().getTime())
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <Card className={classes.root}>
        <CardContent>
          <Typography component="h5" variant="h5" mb={5}>
            {item.id ? 'Editar objetivo': 'Nuevo objetivo'}
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
            <Box mt={3}>
              <TextField
                fullWidth
                label="Ámbito"
                name="ambito"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.ambito}
                variant="outlined"
              >
                {Object.keys(AMBITOS).map((key) => (
                  <option
                    key={key}
                    value={key}
                  >
                    {AMBITOS[key]}
                  </option>
                ))}
              </TextField>
            </Box>

            <Box mt={3}>
              <Typography component="h5" variant="h5" color="textSecondary" mb={5}>
                {'Competencias'}
              </Typography>
              <Divider />
              {Object.keys(COMPETENCIAS).map(key => (
                <Box key={key} display={'flex'} alignItems="center">
                  <Checkbox
                    name={key}
                    checked={values.competencias ? values.competencias[key] : false}
                    onChange={handleChangeCompetencias}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                  <Typography variant="body1" mb={5}>
                    {COMPETENCIAS[key]}
                  </Typography>
                </Box>
              ))}
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
