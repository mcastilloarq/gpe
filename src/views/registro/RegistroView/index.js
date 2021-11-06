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
import { get, list } from 'src/services/firebaseDB';

const orderedDays = (days) => {
  const WEEK = ['sunday',
                'lunes',
                'martes',
                'miercoles',
                'jueves',
                'viernes'];
  return WEEK.map((d) => days.find((day) => day.id === d));
};

const MONTHS = ['Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre'];

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CustomerListView = () => {
  const classes = useStyles();
  const [clientId, setClientId] = useState();
  const [profes, setProfes] = useState([]);
  const navigate = useNavigate();
  const [settings, setSettings] = useState();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [monthRecords, setMonthRecords] = useState([]);
  const [month, setMonth] = useState();
  const [monthId, setMonthId] = useState();
  const [calendar, setCalendar] = useState();

  const populateMonth = async (date = monthId, id = clientId) => {
    const firstDay = new Date(date);
    const y = firstDay.getFullYear();
    const m = firstDay.getMonth();
    setMonth(m);
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    let clientSettings = orderedDays(await list(`clients/${id}/settings`));

    const monthArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const day = i;
      const dayId = new Date(new Date(new Date(new Date().setFullYear(y)).setMonth(m)).setDate(i)).setHours(0,0,0,0);
      const dayOfWeek = new Date(dayId).getDay();
      monthArray.push({
        day,
        dayId,
        weekend: [6, 0].includes(dayOfWeek),
        switch2IsOn: clientSettings[dayOfWeek] && clientSettings[dayOfWeek].switch2IsOn
      });
    }
    setMonthRecords(monthArray);
  };

  const populateProfes = async (id = clientId, date = monthId) => {
    const profes = await list(`clients/${id}/profes`, 'name');
    if (profes) {
      const records = await list(`clients/${id}/records/${date}/profes`);
      const newProfes = profes.map((p) => {
        p.records = records.find((r) => r.id === p.id);
        return p;
      });
      setProfes(newProfes);
      setFilteredUsers(newProfes);
    }
  };

  const populateCalendar = async (id) => {
    let calendar = await list(`clients/${id}/calendar`);
    setCalendar(calendar);
  };

  const filterUsers = (query) => {
    const regex = new RegExp(query);
    const result = profes.filter(p => p.name.match(regex));
    setFilteredUsers(result);
  };
  
  const goBackMonth = () => {
      const newMonthId = new Date(monthId).setMonth(month - 1);
      const newMonth = new Date(newMonthId).getMonth();
    if (newMonth !== 7) {
      setMonth(newMonth);
      setMonthId(newMonthId);
      populateMonth(newMonthId);
    }
  };
  
  const goForwardMonth = () => {
      const newMonthId = new Date(monthId).setMonth(month + 1);
      const newMonth = new Date(newMonthId).getMonth();
    if (newMonth !== 6) {
      setMonth(newMonth);
      setMonthId(newMonthId);
      populateMonth(newMonthId);
    }
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser?.emailVerified) {
        setClientId(firebaseUser.uid);
        const date = new Date(new Date().setDate(1)).setHours(0,0,0,0);
        populateProfes(firebaseUser.uid, date);
        populateMonth(date, firebaseUser.uid);
        populateCalendar(firebaseUser.uid);
        setMonthId(date);
      } else {
        navigate('/app/home', { replace: true });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page
      className={classes.root}
      title="Fichar - Registro"
    >
      <Container maxWidth={false}>
        <Toolbar
          filterUsers={filterUsers}
          monthName={MONTHS[month]}
          month={monthRecords}
          profes={filteredUsers}
          calendar={calendar}
          goBackMonth={goBackMonth}
          goForwardMonth={goForwardMonth}
        />
        <Box mt={3}>
          <Results
            month={monthRecords}
            profes={filteredUsers}
            calendar={calendar}
          />
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
