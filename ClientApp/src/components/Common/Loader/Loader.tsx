import React from 'react';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loader = () => {

  return (
    <Grid container spacing={0} justifyContent="center">
      <CircularProgress disableShrink />
    </Grid>
  );

}
export default Loader;
