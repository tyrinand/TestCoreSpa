import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { clientsRoute, clientsPagesRoute, clientCreateRoute, clientEditRoute } from './Interface/RouteConst';
import { softRoute, softPagesRoute, softCreateRoute, softEditRoute } from './Interface/RouteConst';
import { salesRoute, salesPagesRoute, salesCreateRoute, salesEditRoute, MainAuthPath } from './Interface/RouteConst';
import { lazy } from 'react';

const Clients = lazy(() => import('./components/Clients/Clients'));
const FormClient = lazy(() => import('./components/Clients/ClientsForm'));

const Softs = lazy(() => import('./components/Softs/Softs'));
const FormSoft = lazy(() => import('./components/Softs/FormSoft'));

const Sales = lazy(() => import('./components/Sales/Sales'));
const FormSales = lazy(() => import('./components/Sales/FormSales'));

interface IProps {
  isAuth: boolean
}

const PrivateRouts = (props: IProps) => {

  if (props.isAuth === false)
    return <Redirect to={MainAuthPath} />;

  return (
    <Switch>
      <Route path={clientsRoute} component={Clients} exact />
      <Route path={clientsPagesRoute} component={Clients} />
      <Route path={clientCreateRoute} render={() => <FormClient formMode='createMode' />} />
      <Route path={clientEditRoute} render={() => <FormClient formMode='editMode' />} />

      <Route path={softRoute} component={Softs} exact />
      <Route path={softPagesRoute} component={Softs} />
      <Route path={softCreateRoute} render={() => <FormSoft formMode='createMode' />} />
      <Route path={softEditRoute} render={() => <FormSoft formMode='editMode' />} />

      <Route path={salesRoute} component={Sales} exact />
      <Route path={salesPagesRoute} component={Sales} />
      <Route path={salesCreateRoute} render={() => <FormSales formMode='createMode' />} />
      <Route path={salesEditRoute} render={() => <FormSales formMode='editMode' />} />
    </Switch>
  );
}

export default PrivateRouts;