import React from 'react';
import Typography from '@material-ui/core/Typography';

const Info = () => {

  return (<div>
    <Typography variant='h6'>Тестовый проект SPA</Typography> 
    <span> Используемые технологии : </span>
    <ul>
      <li>React TS</li>
      <li>MATERIAL-UI</li>
      <li>net core Api</li>
    </ul>
  </div>)
}

export default Info;