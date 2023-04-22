import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import { IClient } from './../../Interface/MainTypes';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CloseIcon from '@material-ui/icons/Close';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

interface IClientModal {
  client: IClient,
  iconClassName: string
}


const useStyles = makeStyles({
  paper: {
    position: 'absolute',
    width: 500,
    top: "10%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    textAlign: "center",
    padding: "25px"
  },
  titles:
  {
    fontWeight: 'bold',
  },
  table:
  {
    width: "60%"
  }
}
);


export default function ClientModal(props: IClientModal) {

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const client = props.client;

  const body = (
    <div className={classes.paper}>
      <Grid container spacing={0} justifyContent="center">
        <Grid item md={11}>
          <span>Информация о копупателе</span>
        </Grid>
        <Grid item md={1}>
          <CloseIcon
            className={props.iconClassName}
            onClick={handleClose}
          />
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={0} justifyContent="center">
        <Table size="small" className={classes.table} >
          <TableBody>
            <TableRow key={client.name}>
              <TableCell className={classes.titles} align="left">Полное Имя</TableCell>
              <TableCell align="left">{client.name}</TableCell>
            </TableRow>
            <TableRow key={client.mark}>
              <TableCell className={classes.titles} align="left">Оценка</TableCell>
              <TableCell align="left">{client.mark}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
    </div>
  );

  return (
    <>
      <VisibilityIcon
        className={props.iconClassName}
        onClick={handleOpen}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </>
  );
}

