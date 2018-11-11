import { takeEvery } from 'redux-saga/effects'
import { call, put } from 'redux-saga/effects'
import { pingApi } from 'src/jscommon/apis/index'

export type PingCommand = {
    type: "PING_NETWORK_FOR_IP"
} | {
    type: "PING_GET_DTO"
} | {
    type: "PING_POST_DTO"
} | {
    type: "PING_GET_STRINGS"
} | {
    type: "PING_POST_STRINGS"
} 

export const PingCommands = {
    pingForIp: ():PingCommand => ({ type: "PING_NETWORK_FOR_IP" }),
    pingGetDto: ():PingCommand => ({ type: "PING_GET_DTO" }),
    pingGetStrings: ():PingCommand => ({ type: "PING_GET_STRINGS" }),
    pingPostDto: ():PingCommand => ({ type: "PING_POST_DTO" }),    
    pingPostString: ():PingCommand => ({ type: "PING_POST_STRINGS" })
} 

export type PingEvent = {
    type: "PING_FAILED"
} | {
    type: "PING_NETWORK_FOR_IP_SUCCESS"
    ip: string
} | {
    type: "PING_SUCCESS_DTO"
    dto: { value: string }
} | {
    type: "PING_SUCCESS_STRINGS"
    values: string[]
}

/************************ SAGA *********************/


export class PingSaga {
    constructor () {
        this.saga = this.saga.bind(this)
        this.testIp = this.testIp.bind(this)
        this.pingGetStrings = this.pingGetStrings.bind(this)
    }

    /*************** Register listeners ********************/
    public *saga(): Iterator<any> {
        yield takeEvery('PING_NETWORK_FOR_IP', (command:PingCommand) => this.testIp(command))        
        yield takeEvery("PING_GET_STRINGS" , (command:PingCommand) => this.pingGetStrings(command))       
        yield takeEvery("PING_GET_DTO"    , (command:PingCommand) => this.pingGetDto(command))    
        // yield takeEvery("PING_POST_DTO"   , (command:PingCommand) => this.ping(command))     
        
        // yield takeEvery("PING_POST_STRING", (command:PingCommand) => this.ping(command))
    }

    public *testIp(action: PingCommand){

        const responseIp: {ip:string} = yield call(pingApi.testIp)

        // tslint:disable-next-line:no-console
        console.log(responseIp)

        yield put( { 
            ip: responseIp.ip,
            type: "PING_NETWORK_FOR_IP_SUCCESS"
        } as PingEvent)
    }

    public *pingGetStrings(action: PingCommand){

        const responses: string[] = yield call(pingApi.pingGetStrings)

        // tslint:disable-next-line:no-console
        console.log(responses)

        yield put( { 
            type: "PING_SUCCESS_STRINGS",
            values: responses
        } as PingEvent)
    }

    public *pingGetDto(action: PingCommand){

        const responses: {value:string} = yield call(pingApi.pingGetStrings)

        // tslint:disable-next-line:no-console
        console.log(responses)

        yield put( { 
            dto: responses,
            type: "PING_SUCCESS_DTO",
        } as PingEvent)
    }

}
