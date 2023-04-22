import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { serverUrlLogOut } from './Interface/ServerRouteConst';
import { post } from './Utils/Fetch';
import Loader from './components/Common/Loader/Loader';
import { IComponentStatus, IAuthStatus } from './Interface/MainTypes';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ApplicationState } from './store/index';
import { connect, ConnectedProps } from 'react-redux';
import { SetAuth, AuthStatusState } from './store/AuthStore';
import ShowError from './components/Common/ShowError/ShowError';
import OutputIcon from '@material-ui/icons/ExitToApp';
import InputIcon from '@material-ui/icons/Input';
import { MainAuthPath } from './Interface/RouteConst';


const useStyles = makeStyles((theme) => ({
  container: {
    color: "#fff",
  },
  btn: {
    cursor: "pointer"
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

const getAuhtStatus = (appAuth: AuthStatusState | undefined): boolean => {
  if (appAuth)
    return appAuth.appAuth.isAuth;
  return false;
}

const getAuthLogin = (appAuth: AuthStatusState | undefined): string | null => {
  if (appAuth)
    return appAuth.appAuth.login
  return null;
}

const UserHeader = (props: PropsFromRedux) => {
  let history = useHistory();
  const classes = useStyles();

  const [status, setStatus] = useState<IComponentStatus>('idle');
  const [error, setError] = useState<Error | null>(null);

  const goToAuthPage = () => { history.push(MainAuthPath) }

  const logOut = () => {
    post<null, IAuthStatus>(serverUrlLogOut, null)
      .then((response: IAuthStatus) => {
        setStatus('success');
        props.setAuth(response);
      })
      .catch((error: any) => {
        setError(error);
        setStatus('error');
      })
  }

  if (error) {
    return <ShowError message={error.stack ? error.stack : error.message} />
  }

  if (status === 'pending')
    return <Loader />;

  if (getAuhtStatus(props.appAuth) === false) {
    return (
      <div className={classes.container}>
        <Grid container direction="row" alignItems="center" justifyContent="flex-end" >
          <Grid item={true} lg={12} md={12} xs={12} sm={12} >
            <Grid container direction="row" alignItems="center" justifyContent="flex-end" >
              <InputIcon style={{ cursor: "pointer" }} titleAccess="Login" onClick={goToAuthPage} />
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
  else {
    return (
      <div className={classes.container}>
        <Grid container alignItems="center" justifyContent="flex-end" spacing={0} >
          <Grid item={true} lg={11} md={11} xs={11} sm={11} >
            {getAuthLogin(props.appAuth)}
          </Grid>
          <Grid item={true} lg={1} md={1} xs={1} sm={1} >
            <Grid container direction="row" alignItems="center" justifyContent="flex-end" >
              <OutputIcon style={{ cursor: "pointer" }} titleAccess="LogOut" onClick={logOut} />
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }

}

export default connector(UserHeader);