import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  makeStyles
} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIconIcon from '@material-ui/icons/ArrowForwardIos';
import { Search as SearchIcon } from 'react-feather';
import { jsPDF } from "jspdf";

const useStyles = makeStyles((theme) => ({
  root: {},
  search: {
    flexGrow: '1'
  },
  timeNavigationButton: {
    marginRight: theme.spacing(1)
  },
  monthName: {
    width: '5em',
    display: 'inline-flex',
    justifyContent: 'center'
  }
}));

const Toolbar = ({ className, monthName, month, profes, calendar, filterUsers, goBackMonth, goForwardMonth, ...rest }) => {
  const classes = useStyles();

  const handleOnChange = (e) => {
    filterUsers(e.target.value);
  };

  const handleExportPDF = () => {
    const isHoliday = (d) => {
      const curso = calendar.find(a => a.id === 'curso');
      if (curso.from > d.dayId || curso.to < d.dayId) return true;
      const dnl = calendar.find(a => a.id === 'diasNoLectivos');
      return dnl.dias.some((h) => h.from <= d.dayId && h.to >= d.dayId);
    };
    
    const headers = month.map((d) => {
      let header = ' ' + d.day;
      if (d.day < 10) header = ' ' + header;
      if (d.switch2IsOn && !isHoliday(d)) header = header + '/T';
      header = header + ' ';
      return header;
    }).join('');

    const noRecordDay = (d) => {
      if (d.weekend || isHoliday(d)) return true;
      const today = new Date().setHours(0,0,0,0);
      if (today < d.dayId) return true;
    };

    const getRecord = (d, profe) => {
      if (noRecordDay(d)) return '   ';
      let record = ' ';
      if (d.day <= 10) record = ' ' + record;
      const switch1 = '' + d.dayId + '-1';
      const switch2 = '' + d.dayId + '-2';

      if (profe.records && profe.records[switch1]) {
        record = record + (profe.records[switch1].status === 'tarde' ? 'R' : ' ');
      } else if (!(profe.records && profe.records[switch1])) {
        record = record + 'F';
      } 
      if (d.switch2IsOn) {
        record = record + '/';
        if (profe.records && profe.records[switch2]) {
          record = record + (profe.records[switch2].status === 'tarde' ? 'R' : ' ');
        } else if (!(profe.records && profe.records[switch2])) {
          record = record + 'F';
        }
      }
      if (d.day >= 10) record = record + ' ';
      // record = record + ' ';
      return record;
    };

    const data = profes.map((p) => {
      return month.map((d) => {
        return getRecord(d, p);
      }).join(' ');
    });

    const nombres = profes.map((p) => {
      return p.name;
    });

    const insertBlankLine = (arr) => {
      for (let i = 5; i < arr.length; i = i + 6) {
        arr.splice(i, 0, '');
      }
      return arr;
    };
    
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFont("courier", "bold");
    doc.setFontSize(12);
    doc.text(monthName, 10, 10);
    doc.setFontSize(7);
    doc.text(headers, 50, 10);
    doc.text(insertBlankLine(nombres), 10, 15);
    doc.line(10, 11, 280, 11);
    doc.setFont("courier", "normal");
    doc.text(insertBlankLine(data), 50, 15);
    doc.save(`informe_${monthName}.pdf`);
  };

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap"
      >
        <Box width={500} mr={'auto'}>
          <TextField
            onChange={handleOnChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon
                    fontSize="small"
                    color="action"
                  >
                    <SearchIcon />
                  </SvgIcon>
                </InputAdornment>
              )
            }}
            placeholder="Buscar usuario"
            variant="outlined"
          />
        </Box>
        <Box>
          <IconButton onClick={() => goBackMonth()}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography
            color="textPrimary"
            display='inline'
            className={classes.monthName}
          >
            {monthName}
          </Typography>
          <IconButton onClick={() => goForwardMonth({})}>
            <ArrowForwardIosIconIcon />
          </IconButton>
          <Button
            color="primary"
            variant="contained"
            onClick={handleExportPDF}
          >
            Exportar PDF
          </Button>
          </Box>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
