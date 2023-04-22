import React from 'react';
import { NavLink } from 'react-router-dom';
import PaginationItem from '@material-ui/lab/PaginationItem';
import Pagination from '@material-ui/lab/Pagination';
import Grid from '@material-ui/core/Grid';

interface IPaginateBtn {
  page: number,
  count: number,
  to: string
}


const PaginationBtn = (props: IPaginateBtn) => {
  if(props.count > 1)
  {
    return (
      <Grid container spacing={0} justifyContent="center">
        <Pagination
          page={props.page}
          count={props.count}
          renderItem={(item) => (
            <PaginationItem
              component={NavLink}
              to={`${props.to}/page/${item.page}`}
              {...item}
            />
          )}
        />
      </Grid>
    )
  }

  return null;
}

export default PaginationBtn;