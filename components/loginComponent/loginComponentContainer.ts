import { connect } from 'react-redux';
import * as redux from 'redux';
import * as state from 'src/core/reducers/index';
import { 
    AuthenticationCommand,
    AuthenticationCommands, 
    AuthHeaderClaims, 
    AuthPayloadClaims,
    UserCreds,
    } from 'src/jscommon/actions/AuthenticationSaga';

export type AttributeProps = {} & {    
}
  
export type StateProps = {} & {
    isAuthenticated: boolean,
    token: string,
    headerClaims: AuthHeaderClaims | void,
    payloadClaims: AuthPayloadClaims | void
}
  
export type ConnectedDispatch = {} & {
    login?:(creds:UserCreds) => void
}


const mapStateToProps = (state1: state.All, ownProps: AttributeProps): StateProps => {
    return {
        headerClaims: state1.auth.headerClaims,
        isAuthenticated: state1.auth.isAuthenticated,
        payloadClaims: state1.auth.payloadClaims,
        token: state1.auth.token
    } }

const mapDispatchToProps = (dispatch: redux.Dispatch<AuthenticationCommand>): ConnectedDispatch => {
    return {
        login: (creds:UserCreds) => dispatch(AuthenticationCommands.login(creds))
    }
}    

export const connectContainer = 
    connect<{}, {}, AttributeProps>(mapStateToProps, mapDispatchToProps)
  
