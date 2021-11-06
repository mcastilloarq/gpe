import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
  cardActions: {
    float: 'right'
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: colors.red[600]
  }
}));

export default function SimpleModal({ profe, deleteProfeDialog, deleteProfe, closeDeleteProfeDialog }) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);

  const handleClose = () => {
    closeDeleteProfeDialog();
  };

  const handleDelete = () => {
    deleteProfe(profe);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <Card className={classes.root}>
        <CardContent>
          <Typography component="h5" variant="h5" mb={5}>
            Eliminar usuario
          </Typography>
          <Divider />
          <Typography component="h2" variant="h5" mb={5}>
            ¿Seguro que quieres eliminar a <b>{profe.name}</b>?
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Button
            type='submit'
            size="small" 
            color="default"
            variant="contained"
            onClick={handleClose}
          >Cancelar</Button>
          <Button
            className={classes.deleteButton}
            type='submit'
            size="small" 
            color="secondary"
            variant="contained"
            onClick={handleDelete}
          >Eliminar</Button>
        </CardActions>
      </Card>
    </div>
  );

  return (
    <Modal
      open={deleteProfeDialog}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  );
}
