import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { NavLink } from 'react-router-dom';

interface IBtnCreate{
  url : string
}

const CreateBtn = (props : IBtnCreate) => {
    return (
        <Grid container spacing={0} justifyContent="center" style={{ marginTop : "1%" }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="small"
          component={NavLink} to={props.url}
          >
            Добавить
          </Button>
        </Grid> 
    );
}

export default CreateBtn;