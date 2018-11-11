import { takeEvery } from 'redux-saga/effects'
import { call, put } from 'redux-saga/effects'
import { pingApi } from 'src/jscommon/apis/index'

export type UserCreds = {} & {
    username: string
    password: string
}

export type AuthenticationCommand = {
    type: "AUTHN_LOGIN"
    creds: UserCreds
} | {
    type: "AUTHN_LOGOUT"
} 

export const AuthenticationCommands = {
    login: (creds:UserCreds):AuthenticationCommand => ({ type: "AUTHN_LOGIN", creds }),
    logout: ():AuthenticationCommand => ({ type: "AUTHN_LOGOUT" })
} 

export type AuthHeaderClaims = {} & {
    alg: string
    kid: string
    typ: string
}

export type AuthPayloadClaims = {} & {
    "nbf":string
    "exp":number
    "iss":string
    "aud":string[]
    "client_id":string
    "scope":string[]
}

export type AuthenticationEvent = {
    type: "AUTHN_LOGGEDIN"    
    scopes: string[]
    token: string
    headerClaims?: AuthHeaderClaims
    payloadClaims?: AuthPayloadClaims
} | {
    type: "AUTHN_LOGGEDOUT"
} | {
    type: "AUTHN_LOGINFAILED"
} 

/************************ SAGA *********************/


export class AuthenticationSaga {
    constructor () {
        this.saga = this.saga.bind(this)
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
    }

    /*************** Register listeners ********************/
    public *saga(): Iterator<any> {
        yield takeEvery('AUTHN_LOGIN', (command:AuthenticationCommand) => this.login(command))        
        yield takeEvery("AUTHN_LOGOUT" , (command:AuthenticationCommand) => this.logout(command))       
    }

    public *login(action: AuthenticationCommand){

        const response: {access_token:string} = yield call(pingApi.getConnectToken)

        // tslint:disable-next-line:no-console
        console.log(response)

        const headerClaims:AuthHeaderClaims = JSON.parse(window.atob(response.access_token.split('.')[0]))
        const payloadClaims:AuthPayloadClaims = JSON.parse(window.atob(response.access_token.split('.')[1]))
        
        yield put( { 
            headerClaims,
            payloadClaims,
            scopes: [],
            token: response.access_token,
            type: "AUTHN_LOGGEDIN"
        } as AuthenticationEvent)
    }

    public *logout(action: AuthenticationCommand){

        const responses: string[] = yield call(pingApi.pingGetStrings)

        // tslint:disable-next-line:no-console
        console.log(responses)

        yield put( { 
            type: "AUTHN_LOGGEDOUT"
        } as AuthenticationEvent)
    }

}
