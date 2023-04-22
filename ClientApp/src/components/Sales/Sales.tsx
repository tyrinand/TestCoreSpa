import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ISalesView, IComponentStatus, PagesData } from './../../Interface/MainTypes';
import { serverUrlSales } from './../../Interface/ServerRouteConst';
import { get } from './../../Utils/Fetch';
import { salesRoute, salesEditPath, salesCreateRoute } from './../../Interface/RouteConst';
import Loader from '../Common/Loader/Loader';
import ShowError from '../Common/ShowError/ShowError';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CreateBtn from './../Buttons/CreateBtn';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import SaleModal from './SaleModal';
import EditBtn from '../Buttons/EditBtn';
import DeleteBtn from '../Buttons/DeleteBtn';
import PaginationBtn from './../Buttons/PaginationBtn';

const useStyles = makeStyles({
    titles: {
      fontWeight: 'bold',
      width: "14%"
    },
    icons: {
      cursor: "pointer"
    }
})

const Sales = () => {

  let history = useHistory();
  const classes = useStyles();

  const { page } = useParams<{ page?: string }>();
  const pageNum: number = page ? Number(page) : 1;

  const pageSize = 2;

  const [sales, setSales] = useState<Array<ISalesView> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<IComponentStatus>('idle');
  const [countPage, setCountPage] = useState<number>(0);
  
  useEffect(() => {
    get<PagesData<ISalesView>>(`${serverUrlSales}/?PageNumber=${pageNum}&PageSize=${pageSize}`)
      .then((response: PagesData<ISalesView>) => {
        setSales(response.items);
        setCountPage(response.countPage);
        setStatus('success');
      })
      .catch((error: Error) => {
        setError(error);
        setStatus('error');
      })
  }, [pageNum]);

  const dropInList = (id: number): void => {
    if (sales != null) {
      const newArray: Array<ISalesView> = sales.filter(x => x.id !== id);

      if (newArray.length > 0) {
        setSales(newArray);
      }
      else {
        const url: string = `${salesRoute}/page/${pageNum - 1}`;
        history.push(url);
      }
    }
  }

  if (error) {
    return <ShowError message={error.stack ? error.stack : error.message} />
  }

  if (status === 'pending' || status === 'idle') {
    return (<Loader />);
  }

  if (status === "success" && sales != null && sales.length === 0) {
    return (
      <Grid container spacing={0} justifyContent="center">
        <Typography variant='subtitle2' >Пустой список</Typography>
        <CreateBtn url={salesCreateRoute} />
      </Grid>
    );
  }

  if (status === "success" && sales != null) {
    return (
      <>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" className={classes.titles}>Софт</TableCell>
                <TableCell align="center" className={classes.titles}>Цена за единицу</TableCell>
                <TableCell align="center" className={classes.titles}>Кол-во</TableCell>
                <TableCell align="center" className={classes.titles}>Полная стоимость</TableCell>
                <TableCell align="center" className={classes.titles}>Дата</TableCell>
                <TableCell align="center" className={classes.titles}>Клиент</TableCell>
                <TableCell align="center" className={classes.titles}>Действие</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((item) => (
                <TableRow key={item.id}>
                  <TableCell align="center">{item.softName}</TableCell>
                  <TableCell align="center">{item.priceOne}</TableCell>
                  <TableCell align="center">{item.count}</TableCell>
                  <TableCell align="center">{item.summ}</TableCell>
                  <TableCell align="center">{item.dateBuyStr}</TableCell>
                  <TableCell align="center">{item.clientName}</TableCell>
                  <TableCell align="center">
                    <SaleModal
                      iconClassName={classes.icons}
                      sale={item}
                    />
                    <EditBtn
                      id={item.id}
                      url={salesEditPath}
                      className={classes.icons}
                    />
                    <DeleteBtn
                      id={item.id}
                      url={serverUrlSales}
                      updateList={dropInList}
                      setError={setError}
                      setStatus={setStatus}
                      className={classes.icons}
                    />
                  </TableCell>
                </TableRow>
              ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <CreateBtn url={salesCreateRoute} />
        <br />
        <PaginationBtn
          to={salesRoute}
          page={pageNum}
          count={countPage}
        />
      </>
    );
  }

  return (<div>440</div>)
}

export default Sales;