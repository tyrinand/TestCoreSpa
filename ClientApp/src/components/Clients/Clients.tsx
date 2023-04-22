import React from 'react';
import { get } from './../../Utils/Fetch';
import { useState, useEffect } from 'react';
import { IClient, IComponentStatus, PagesData } from './../../Interface/MainTypes';
import { serverUrlClients } from './../../Interface/ServerRouteConst';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import { clientsRoute, clientEditPath, clientCreateRoute } from './../../Interface/RouteConst';
import Loader from '../Common/Loader/Loader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CreateBtn from './../Buttons/CreateBtn';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';
import ClientModal from './ClientModal';
import EditBtn from '../Buttons/EditBtn';
import DeleteBtn from '../Buttons/DeleteBtn';
import PaginationBtn from './../Buttons/PaginationBtn';
import ShowError from '../Common/ShowError/ShowError';

const useStyles = makeStyles({
  titles:
  {
    fontWeight: 'bold',
    width: "33%"
  },
  icons: {
    cursor: 'pointer'
  }
}
);

const Clients = () => {
  let history = useHistory();
  const classes = useStyles();
  const { page } = useParams<{ page?: string }>();
  const pageNum: number = page ? Number(page) : 1;

  const pageSize = 2; // для теста

  const [clients, setClients] = useState<Array<IClient> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<IComponentStatus>('idle');
  const [countPage, setCountPage] = useState<number>(0);

  const targetUrl = `${serverUrlClients}/?PageNumber=${pageNum}&PageSize=${pageSize}`;

  useEffect(() => {

    get<PagesData<IClient>>(targetUrl)
      .then((response: PagesData<IClient>) => {
        setClients(response.items);
        setCountPage(response.countPage);
        setStatus('success');
      })
      .catch((error: any) => {
        setError(error);
        setStatus('error');
      })
  }, [targetUrl])


  const dropInList = (id: number): void => {
    if (clients != null) {
      const newArray: Array<IClient> = clients.filter(x => x.id !== id);
      if (newArray.length > 0) {
        setClients(newArray);
      }
      else {
        const url: string = `${clientsRoute}/page/` + (pageNum - 1);
        history.push(url);
      }
    }
  }


  if (error) {
    return <ShowError message={error.stack ? error.stack : error.message} />
  }


  if (status === 'pending' || status === 'idle')
    return <Loader />



  if (status === "success" && clients != null && clients.length === 0) {
    return (
      <Grid container spacing={0} justifyContent="center">
        <Typography variant='subtitle2' >Пустой списко</Typography>
        <CreateBtn url={clientCreateRoute} />
      </Grid>
    );
  }


  if (status === "success" && clients != null) {
    return (
      <>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow >
                <TableCell align="center" className={classes.titles}>Полное имя</TableCell>
                <TableCell align="center" className={classes.titles}>Оценка</TableCell>
                <TableCell align="center" className={classes.titles}>Действие</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((item) => (
                <TableRow key={item.id}>
                  <TableCell align="center">{item.name}</TableCell>
                  <TableCell align="center">{item.mark}</TableCell>
                  <TableCell align="center">
                    <ClientModal
                      iconClassName={classes.icons}
                      client={item}
                    />
                    <EditBtn
                      id={item.id}
                      url={clientEditPath}
                      className={classes.icons}
                    />
                    <DeleteBtn
                      id={item.id}
                      url={serverUrlClients}
                      updateList={dropInList}
                      setError={setError}
                      setStatus={setStatus}
                      className={classes.icons}
                    />

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <br />
        <CreateBtn url={clientCreateRoute} />
        <br />
        <PaginationBtn
          to={clientsRoute}
          page={pageNum}
          count={countPage}
        />

      </>
    )
  }

  return (
    <div>440</div>
  )
}
export default Clients;

