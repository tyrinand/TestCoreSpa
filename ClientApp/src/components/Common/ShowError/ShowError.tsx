import React from 'react';
import Alert from '@material-ui/lab/Alert';

interface IProps{
  message : string | undefined
}

const ShowError = (props : IProps) => {
  if(props.message)
    return (<Alert severity="error" style={{ margin : "2%" }}>{props.message}</Alert>)
    
    return null;
  }

export default ShowError;