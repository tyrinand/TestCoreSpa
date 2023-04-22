import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { useState } from 'react';
import {ISoft} from './../../Interface/MainTypes';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';


interface ISoftModal {
    soft : ISoft,
    iconClassName : string
}


const useStyles = makeStyles({
    paper: {
        position: 'absolute',
        width: 500,
        top: "20%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor : "#fff",
        textAlign : "center",
        padding : "25px"
      },
    titles :
    {
        fontWeight : 'bold',
        width : "15%"
    },
    table :
    {
        width : "70%"
    }}
  );


export default function SoftModal(props : ISoftModal) {

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const soft = props.soft;

  const body = (
    <div className={classes.paper}>
      <Grid container spacing={0} justifyContent="center">
        <Grid item md={11}>
            <span>Информация о Софте</span>
        </Grid>
        <Grid item md={1}>
            <CloseIcon 
                className = {props.iconClassName}
                onClick = {handleClose}
            />
        </Grid>
    </Grid>
    <br/>
        <Grid container spacing={0} justifyContent="center">
            <Table  size="medium" className={classes.table} >
                <TableBody>
                    <TableRow key={soft.name}>
                        <TableCell className={classes.titles} align="left">Наименование</TableCell>
                        <TableCell  align="left">{soft.name}</TableCell>
                    </TableRow>
                    <TableRow key={soft.description}>
                        <TableCell className={classes.titles} align="left">Описание</TableCell>
                        <TableCell align="left">{soft.description}</TableCell>
                    </TableRow>
                    <TableRow key={soft.description}>
                        <TableCell className={classes.titles} align="left">Цена</TableCell>
                        <TableCell align="left">{soft.price}</TableCell>
                    </TableRow>
                    <TableRow key={soft.count}>
                        <TableCell className={classes.titles} align="left">Кол-во</TableCell>
                        <TableCell align="left">{soft.count}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Grid>
    </div>
  );

  return (
    <>
      <VisibilityIcon 
        className = {props.iconClassName}
        onClick = {handleOpen}
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

