import React from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import { get } from './Utils/Fetch';
import { lazy, Suspense, useEffect, useState } from 'react';
import Loader from './components/Common/Loader/Loader';
import { IComponentStatus, IAuthStatus } from './Interface/MainTypes';
import { serverUrlAuth } from './Interface/ServerRouteConst';
import ShowError from './components/Common/ShowError/ShowError';
import { ApplicationState } from './store/index';
import { connect, ConnectedProps } from 'react-redux';
import { SetAuth, AuthStatusState } from './store/AuthStore';
import PrivateRouts from './PrivateRouts';
import { salesRoute, softRoute, clientsRoute, MainAuthPath } from './Interface/RouteConst';
import UserBlock from './UserBlock';

const useStyles = makeStyles( (theme) =>  ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '95vh'
    },
    footer: {
      marginTop: 'auto',
      minHeight: '5vh',
      textAlign: "center"
    },
    link: {
      color: "#002984",
      margin: "10px",
      textDecoration: "none"
    },
    toolbar: {
      flexWrap: 'wrap',
    }
  }
));

const mapStateToProps = (state: ApplicationState) => ({
  appAuth: state.appAuth
});

export const mapDispatchToProps = (dispatch: any) => {
  return {
    setAuth: (auth: IAuthStatus) => dispatch(SetAuth(auth))
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;


const Info = lazy(() => import('./components/Info'));
const MainAuth = lazy(() => import('./components/AuthPage'));

const getAuhtStatus = (appAuth: AuthStatusState | undefined): boolean => {
  if (appAuth)
    return appAuth.appAuth.isAuth;
  return false;
}

function App(props: PropsFromRedux) {
  const [status, setStatus] = useState<IComponentStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const classes = useStyles();

  useEffect(() => {
    get<IAuthStatus>(serverUrlAuth)
      .then((response: IAuthStatus) => {
        props.setAuth(response);
        setStatus('success');
      })
      .catch((error: any) => {
        setError(error);
        setStatus('error');
      })

  }, []);

  if (error) {
    return <ShowError message={error.stack ? error.stack : error.message} />
  }

  if (status === 'pending' || status === 'idle') {
    return <Loader />
  }

  return (
    <BrowserRouter>
      <div className={classes.root}>
        <CssBaseline />
        <Grid container spacing={0} justifyContent="center" >
          <Grid item lg={8} md={12} xs={12} sm={12} >
            <AppBar position="static">
              <Toolbar className={classes.toolbar}>
                <Grid container spacing={1} justifyContent="flex-start" alignItems="center" >
                  <Grid item={true} lg={11} md={11} xs={11} sm={11} >
                    <NavLink className={classes.link} exact to="/">Информация</NavLink>
                    <NavLink className={classes.link} to={salesRoute} >Продажи</NavLink>
                    <NavLink className={classes.link} to={softRoute}>Софт</NavLink>
                    <NavLink className={classes.link} to={clientsRoute} >Клиенты</NavLink>
                    <a href="/swagger/" target="_blank" className={classes.link}>Swagger Api</a>
                  </Grid>
                  <Grid item={true} lg={1} md={1} xs={1} sm={1} >
                    <UserBlock/>
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={0} justifyContent="center">
          <Grid item lg={8} md={12} xs={12} sm={12}>
            <Suspense fallback={<Loader />} >
              <Switch>
                <Route path="/" component={Info} exact />
                <Route path={MainAuthPath} component={MainAuth} />
                <PrivateRouts isAuth={getAuhtStatus(props.appAuth)} />
                <Route component={Info} />
              </Switch>
            </Suspense>
          </Grid>
        </Grid>
        <footer className={classes.footer}>
          <Grid container spacing={0} justifyContent="center">
            <Grid item lg={8} md={12} xs={12} sm={12}>
              {new Date().getFullYear()} 
            </Grid>
          </Grid>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default connector(App);