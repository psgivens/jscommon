import { takeEvery } from 'redux-saga/effects'
import { call, put } from 'redux-saga/effects'
import { api } from 'src/jscommon/apis/index'

export type FetchExampleCommand = {
    type: "FETCH_EXAMPLE_IP"
} | {
    type: "FETCH_EXAMPLE_OTHER"
} 

export const FetchExampleCommands = {
    fetchIp: ():FetchExampleCommand => ({ type: "FETCH_EXAMPLE_IP" })
} 

export type FetchExampleEvent = {
    type: "FETCH_EXAMPLE_IP_FAILED"
} | {
    type: "FETCH_EXAMPLE_IP_SUCCESS"
    ip: string
}

/************************ SAGA *********************/


export class FetchExampleSaga {
    constructor () {
        this.saga = this.saga.bind(this)
        this.testIp = this.testIp.bind(this)
    }

    /*************** Register listeners ********************/
    public *saga(): Iterator<any> {
        yield takeEvery('FETCH_EXAMPLE_IP', (command:FetchExampleCommand) => this.testIp(command))
    }

    public *testIp(action: FetchExampleCommand){

        const responseIp: string = yield call(api.testIp)

        // tslint:disable-next-line:no-console
        console.log(responseIp)

        yield put( { 
            type: "FETCH_EXAMPLE_IP_SUCCESS",
            values: responseIp
        })
    }

}
