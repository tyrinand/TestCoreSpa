import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import { useState } from 'react';
import { ApplicationState } from './../store/index';
import { SetAuth, AuthStatusState } from './../store/AuthStore';
import { IComponentStatus, IAuthStatus, IAuth } from './../Interface/MainTypes';
import { connect, ConnectedProps } from 'react-redux';
import { post } from './../Utils/Fetch';
import { serverUrlAuth } from './../Interface/ServerRouteConst'; 
import { StartPage } from './../Interface/RouteConst';
import Loader from './Common/Loader/Loader';
import ShowError from './Common/ShowError/ShowError';

const mapStateToProps = (state: ApplicationState) => ({
  appAuth: state.appAuth
});

export const mapDispatchToProps = (dispatch: any) => {
  return {
    updateAppState: (auth: IAuthStatus) => dispatch(SetAuth(auth))
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const getAuhtStatus = (appAuth: AuthStatusState | undefined): boolean => {
  if (appAuth)
    return appAuth.appAuth.isAuth;
  return false;
}

const getErrorMessage = (appAuth: AuthStatusState | undefined): string | null => {
  if (appAuth)
    return appAuth.appAuth.errorMessage;
  return null;
}

const MainAuthPage = (props: PropsFromRedux) => {
  const defaultValue: IAuth = { login: "", password: "" };
  const [status, setStatus] = useState<IComponentStatus>('idle');
  const [auth, setAuth] = useState<IAuth>(defaultValue);
  const [error, setError] = useState<Error | null>(null);

  const handelChangeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value: login } } = e;
    const newAuth = { ...auth, login: login };
    setAuth(newAuth);
  }

  const handelChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value: password } } = e;
    const newAuth = { ...auth, password: password };
    setAuth(newAuth);
  }

  const handelSend = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (auth.login.length > 0 && auth.password.length > 0) {
      setStatus('pending');
      post<IAuth, IAuthStatus>(serverUrlAuth, auth)
        .then((response: IAuthStatus) => {
          setStatus('success');
          props.updateAppState(response);
        })
        .catch((error: any) => {
          setError(error);
          setStatus('error');
        })
    }
  }


  if (getAuhtStatus(props.appAuth)) {
    return <Redirect to={StartPage} />;
  }

  let title: JSX.Element | null = null;
  const errorMessage : string | null = getErrorMessage(props.appAuth);

  if (errorMessage !== null) {
    title = <span style={{ color: "red", textAlign: "center" }}>{errorMessage}</span>;
  }

  const Form: JSX.Element = (
    <form noValidate autoComplete="off" >
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={12} md={12} >
          <TextField
            label="Логин"
            fullWidth
            onChange={handelChangeLogin}
            value={ auth.login }
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <TextField
            label="Пароль"
            fullWidth
            type="password"
            autoComplete="off"
            onChange={handelChangePassword}
            value={ auth.password }
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Grid container spacing={0} justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handelSend}
            >Вход</Button>
          </Grid>
        </Grid>
      </Grid>
    </form>);

if (error) {
  return <ShowError message={error.stack ? error.stack : error.message} />
}

  return (

    <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ marginTop: "3%" }} >
      <Grid item={true} lg={12}  md={12}  xs={12} sm={12}  > 
        <Grid container spacing={0} justifyContent="center">
        {title}
        </Grid> 
      </Grid>
      <Grid item={true} lg={4}  md={4}  xs={4} sm={4}  >
        {status === 'pending' ? (<Loader/>) : Form}
      </Grid>
    </Grid>
  );
}

export default connector(MainAuthPage);