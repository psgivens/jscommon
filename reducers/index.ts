import { authenticationReducer, AuthenticationState } from './AuthenticationReducers';
import { pingReducer, PingState } from './PingReducers';

export type Common = {} & {
    auth: AuthenticationState,
    ping: PingState
  }  

export const commonReducers = {
    auth: authenticationReducer,
    ping: pingReducer
}

