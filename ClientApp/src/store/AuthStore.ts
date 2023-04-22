import { Action, Reducer } from 'redux';
import { IAuthStatus } from './../Interface/MainTypes'; 

export interface AuthStatusState {
  appAuth : IAuthStatus 
}


export interface SetAuthAction  { type: 'SET_AUTH',  auth : IAuthStatus }

export type KnownAction = SetAuthAction;

export const SetAuth = (auth : IAuthStatus) : SetAuthAction => (
  { type: 'SET_AUTH', auth }
)

export const reducer: Reducer<AuthStatusState> = (state: AuthStatusState | undefined, incomingAction: Action): AuthStatusState => {
  if (state === undefined) {
      return { appAuth : { isAuth : false, login : null, errorMessage : null } };
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
      case 'SET_AUTH':
          return { appAuth : action.auth };
      default:
          return state;
  }
};