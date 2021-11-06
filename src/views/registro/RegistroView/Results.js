import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  },
  oddCell: {
    backgroundColor: colors.grey[50]
  },
  weekend: {
    backgroundColor: colors.grey[200]
  },
  cell: {
    textAlign: 'center'
  },
  cellText: {
    whiteSpace: 'nowrap'
  },
  container: {
    maxHeight: 600,
  },
  tarde: {
    color: colors.orange[600],
    fontWeight: 'bold'
  },
  falta: {
    color: colors.red[900],
    fontWeight: 'bold'
  },
  grey: {
    color: colors.grey[500]
  }
}));

const Results = ({ className, profes, month, calendar, ...rest }) => {
  const classes = useStyles();

  const getClassName = (d) => {
    const classNames = [classes.cell];
    if (d.weekend) {
      classNames.push(classes.weekend)
    } else if (d.day%2 !== 0) {
      classNames.push(classes.oddCell);
    }

    return classNames.join(' ');
  };

  const isHoliday = (d) => {
    const curso = calendar.find(a => a.id === 'curso');
    if (curso.from > d.dayId || curso.to < d.dayId) return true;
    const dnl = calendar.find(a => a.id === 'diasNoLectivos');
    return dnl.dias.some((h) => h.from <= d.dayId && h.to >= d.dayId);
  };

  const noRecordDay = (d) => {
    if (d.weekend || isHoliday(d)) return true;
    const today = new Date().setHours(0,0,0,0);
    if (today < d.dayId) return true;
  };

  const getRecord = (d, profe) => {
    let record = <span></span>;
    if (noRecordDay(d)) return record;
    const switch1 = '' + d.dayId + '-1';
    const switch2 = '' + d.dayId + '-2';

    return (
      <span>
        {profe.records && profe.records[switch1] &&
            <span className={classes.tarde}>{profe.records[switch1].status === 'tarde' ? 'R' : ''}</span>
        }
        {!(profe.records && profe.records[switch1]) &&
            <span className={classes.falta}>F</span>
        }
        {d.switch2IsOn &&
          <span>
            <span> / </span>
            {profe.records && profe.records[switch2] &&
              <span className={classes.tarde}>{profe.records[switch2].status === 'tarde' ? 'R' : ''}</span>
            }
            {!(profe.records && profe.records[switch2]) &&
              <span className={classes.falta}>F</span>
            }
          </span>
        }
      </span>
    )

  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <TableContainer className={classes.container}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Nombre
                  </TableCell>
                  {month.map((d) => (
                    <TableCell key={d.day} className={getClassName(d)}>
                      <span className={classes.cellText}>
                        {d.day}
                        {d.switch2IsOn && 
                          <span className={classes.grey}> / T</span>
                        }
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {profes.map((profe) => (
                  <TableRow
                    key={profe.id}
                  >
                    <TableCell>
                      <Box
                        alignItems="center"
                        display="flex"
                      >
                        <Typography
                          color="textPrimary"
                          variant="body1"
                        >
                          {profe.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    {month && month.map((d, i) => (
                      <TableCell key={d.day} className={getClassName(d)}>
                        {getRecord(d, profe)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  profes: PropTypes.array.isRequired
};

export default Results;
