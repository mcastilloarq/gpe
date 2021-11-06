import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  Link,
  TextField,
  Typography,
  Divider,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { createUser } from 'src/services/firebaseFunctions';
import firebase from 'firebase/app';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  divider: {
    marginTop: '8px'
  }
}));

const RegisterView = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (!!firebaseUser) {
        navigate('/app/home', { replace: true });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleRegister(data) {
    await createUser(data)
  }

  return (
    <Page
      className={classes.root}
      title="Crear cuenta"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              confirmEmail: '',
              password: '',
              confirmPassword: '',
              policy: false
            }}
            validationSchema={
              Yup.object().shape({
                email: Yup.string().email('Debes introducir un email válido').max(255).required('Debes introducir un email válido'),
                confirmEmail: Yup.string().oneOf([Yup.ref('email'), null], 'No coincide con el email'),
                password: Yup.string().max(255).required('Debes introducir una contraseña'),
                confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'No coincide con la contraseña'),
                policy: Yup.boolean().oneOf([true], 'Debes marcar que has leído las condiciones')
              })
            }
            onSubmit={handleRegister}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              isValid,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Crear nueva cuenta
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                    align='justify'
                  >
                    Usa una dirección de email válida para crear una cuenta. Te enviaremos un email de confirmación para asegurarnos de que no eres un robot. Esa será la única vez que usemos tu dirección. No te enviaremos nada, ni compartiremos tus datos con nadie.
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.confirmEmail && errors.confirmEmail)}
                  fullWidth
                  helperText={touched.confirmEmail && errors.confirmEmail}
                  label="Confirma Email"
                  margin="normal"
                  name="confirmEmail"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.confirmEmail}
                  variant="outlined"
                />
                <Divider className={classes.divider} />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Contraseña"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  fullWidth
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  label="Confirma contraseña"
                  margin="normal"
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.confirmPassword}
                  variant="outlined"
                />
                <Box
                  alignItems="center"
                  display="flex"
                  ml={-1}
                >
                  <Checkbox
                    checked={values.policy}
                    name="policy"
                    onChange={handleChange}
                  />
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    He leído las 
                    {' '}
                    <Link
                      color="primary"
                      component={RouterLink}
                      to="#"
                      underline="always"
                      variant="h6"
                    >
                      Condiciones
                    </Link>
                  </Typography>
                </Box>
                {Boolean(touched.policy && errors.policy) && (
                  <FormHelperText error>
                    {errors.policy}
                  </FormHelperText>
                )}
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting || !touched.email || !isValid}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Crear cuenta
                  </Button>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  ¿Ya tienes una cuenta?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="h6"
                  >
                    Inicia sesión
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default RegisterView;
