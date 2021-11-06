import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Link,
  colors,
  makeStyles
} from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.indigo[400],
    height: 56,
    width: 56
  },
  disabledAvatar: {
    backgroundColor: colors.grey[400],
    height: 56,
    width: 56
  },
  differenceIcon: {
    color: colors.grey[300]
  },
  differenceValue: {
    color: colors.red[900],
    marginRight: theme.spacing(1)
  }
}));

const Step1 = ({ className, registeredUser, ...rest }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              Paso 1
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              Crea una cuenta
            </Typography>
          </Grid>
          <Grid item>
          {registeredUser ?
            <Avatar className={classes.disabledAvatar}>
              <PersonAddIcon />
            </Avatar>
            :
            <Link href="/register">
              <Avatar className={classes.avatar}>
                <PersonAddIcon />
              </Avatar>
            </Link>
          }
          </Grid>
        </Grid>
        <Box
          mt={2}
        >
          <Typography
            color="textSecondary"
            variant="body1"
          >
            - Ve a la {registeredUser ? 'página de registro' : <a href='/register'>página de registro</a>} y crea una nueva cuenta.
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            - Te enviaremos un email con un enlace para verificar que no eres un robot. Si no lo encuentras en tu bandeja de entrada, busca en tu correo no deseado.
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            - Cuando hayas validado tu cuenta, podrás iniciar sesión y usar la aplicación.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

Step1.propTypes = {
  className: PropTypes.string
};

export default Step1;
