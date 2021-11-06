import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import { colors } from '@material-ui/core';

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
    width: 400,
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

export default function SimpleModal({ profe, profes, profeDialog, saveProfeDialog, closeProfeDialog }) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [currentProfe, setCurrentProfe] = useState({});
  const [nameError, setNameError] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [disabledForm, setDisabledForm] = useState(!profe.id);

  const nameExists = (newName) => {
    return profes.some((p) => p.id !== profe.id && p.name === newName);
  };

  const pinExists = (newPin) => {
    return profes.some((p) => p.id !== profe.id && p.pin === newPin);
  };

  const handleClose = () => {
    closeProfeDialog();
  };

  const handleSave = () => {
    saveProfeDialog(currentProfe);
    setCurrentProfe({});
  };

  const handleChangeName = (e) => {
    const newName = e.target.value;
    let params = { name: newName };
    if (profe.id)  params = Object.assign(params, { id: profe.id });
    if (!currentProfe.pin) params = Object.assign(params, { pin: profe.pin });
    setCurrentProfe(Object.assign(currentProfe, params));
    setNameError(nameExists(newName));
    checkDisabledForm();
  };

  const handleChangePin = (e) => {
    const newPin = e.target.value;
    let params = { pin: newPin };
    if (profe.id) params = Object.assign(params, { id: profe.id });
    if (!currentProfe.name) params = Object.assign(params, { name: profe.name });
    setCurrentProfe(Object.assign(currentProfe, params));
    setPinError(pinExists(newPin));
    checkDisabledForm();
  };

  const checkDisabledForm = () => {
    setDisabledForm(
      !currentProfe.name ||
      !currentProfe.pin?.match(/^[0-9]{4,4}$/)
    );
  };

  // const generatePin = () => {
  //   let randomPin = ('0000' +  Math.floor(Math.random() * 999 + 1)).slice(-4);
  //   while (pinExists(randomPin)) {
  //     randomPin = ('0000' +  Math.floor(Math.random() * 999 + 1)).slice(-4);
  //   }
  //   setCurrentProfe(Object.assign(currentProfe, {pin: randomPin}));
  // }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <Card className={classes.root}>
        <CardContent>
          <Typography component="h5" variant="h5" mb={5}>
            {profe.id ? 'Editar usuario': 'Nuevo usuario'}
          </Typography>
          <Divider />
          <form className={classes.form} noValidate autoComplete="off">
            <TextField
              id="outlined-basic"
              defaultValue={profe.name}
              onChange={handleChangeName}
              className={classes.nameInput}
              label="Nombre"
              variant="outlined"
              autoFocus
              error={nameError}
              helperText={nameError ? 'Este nombre ya existe' : ''}
            />
            <div className={classes.pinSection}>
              <TextField
                id="outlined-basic"
                defaultValue={profe.pin}
                onChange={handleChangePin}
                className={classes.pinInput}
                label="PIN"
                variant="outlined"
                error={pinError}
                helperText={pinError ? 'Este PIN ya existe' : ''}
              />
              <Typography component="h2" variant="body1" ml={5} className={classes.hint}>
                Ej: 1234
              </Typography>
              {/* <Button
                size="small"
                color="primary"
                className={classes.generatePin}
                onClick={generatePin}
              >Generar PIN</Button> */}
            </div>
          </form>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Button
            type='submit'
            size="small" 
            color="primary"
            variant="contained"
            onClick={handleSave}
            disabled={disabledForm || nameError || pinError}
          >Guardar</Button>
        </CardActions>
      </Card>
    </div>
  );

  return (
    <Modal
      open={profeDialog}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  );
}
