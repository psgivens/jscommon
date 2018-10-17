import { call, put, takeEvery } from 'redux-saga/effects'

import { DomainTypes, DomainValues, IoDatabaseCommand, IoDatabaseEvent, IoDataTableName, IoEntity } from '../data/IoDomainCommands'
import { IoDatabaseWorker } from '../workers/IoDatabaseWorker'
import { FetchExampleCommands, FetchExampleSaga } from './FetchExampleSaga'

import { AggregationCommands } from 'src/actions/AggregationSaga'

export type IoPatientManagementCommand = {
    type: "IO_PATIENT_LOADITEMS"
} | {
    type: "IO_PATIENT_ADDITEM"
    item: IoEntity
} | {
    type: "IO_PATIENT_DELETEITEM"
    id: number
} | {
    type: "IO_PATIENT_SELECTITEM"
    item: IoEntity
} 

export type IoPatientManagementDomainEvent = 
    IoPatientManagementEvent & DomainTypes

export type IoPatientManagementDomainCommand =
    IoPatientManagementCommand & DomainTypes

export function createIoPatientManagementCommands (domain:DomainValues) {
    return {
    addItem: (item: IoEntity): IoPatientManagementDomainCommand => ({ domain, type: "IO_PATIENT_ADDITEM", item }),
    deleteItem: (id: number): IoPatientManagementDomainCommand => ({ domain, type: "IO_PATIENT_DELETEITEM", id }),
    loadItems: ():IoPatientManagementDomainCommand => ({ domain, type: "IO_PATIENT_LOADITEMS" }),
    selectItem: (item: IoEntity):IoPatientManagementDomainCommand => ({ domain, type: "IO_PATIENT_SELECTITEM", item })
} }

export type IoPatientManagementEvent = {
    type: "IO_PATIENT_ITEMSLOADED"
    items: IoEntity[]
} | {
    type: "IO_PATIENT_ITEMADDED"    
    item: IoEntity
} | {
    type: "IO_PATIENT_DELETED"    
    id: number
} | {
    type: "IO_PATIENT_IP_FAILED"
} | {
    type: "IO_PATIENT_ITEMSELECTED"
    item: IoEntity
} 

/************************ SAGA *********************/


export class IoPatientManagementSaga {
    private databaseWorker:IoDatabaseWorker
    private tableName: IoDataTableName
    private domain: DomainValues
    constructor (databaseWorker:IoDatabaseWorker, domain:DomainValues, tableName: IoDataTableName) {
        this.databaseWorker = databaseWorker
        this.saga = this.saga.bind(this)
        this.addItem = this.addItem.bind(this)
        this.loadItems = this.loadItems.bind(this)
        this.selectItem = this.selectItem.bind(this)
        this.deleteItem = this.deleteItem.bind(this) 
        this.tableName = tableName
        this.domain = domain
    }

    /*************** Register listeners ********************/
    public *saga(): Iterator<any> {
        yield takeEvery('IO_PATIENT_SELECTITEM', this.selectItem)
        yield takeEvery('IO_PATIENT_ADDITEM', this.addItem)
        yield takeEvery('IO_PATIENT_DELETEITEM', this.deleteItem)
        yield takeEvery('IO_PATIENT_LOADITEMS', this.loadItems)
    }

    private *selectItem(action: IoPatientManagementDomainCommand){
        if (action.domain !== this.domain) { return }

        // an 'if' block casts the action. 
        if (action.type === "IO_PATIENT_SELECTITEM") {
            yield put( {
                domain: this.domain,
                item: action.item,
                type: "IO_PATIENT_ITEMSELECTED"
            } as IoPatientManagementDomainEvent)
        }
    }

    private *addItem(action: IoPatientManagementDomainCommand){
        if (action.domain !== this.domain) { return }

        // an 'if' block casts the action. 
        if (action.type === "IO_PATIENT_ADDITEM") {

            const event: IoDatabaseEvent = yield call((command: IoDatabaseCommand) => this.databaseWorker.post(this.tableName, command), { 
                item:action.item,
                type: "IO_INSERT_PATIENT",
            } as IoDatabaseCommand)

            if (event.type === "IO_PATIENT_INSERTED") {
                yield put( {
                    domain: this.domain,
                    item: event.item,
                    type: "IO_PATIENT_ITEMADDED"
                } as IoPatientManagementDomainEvent)

                yield put(AggregationCommands.buildBroker())
            }
        }
    }

    private *deleteItem(action: IoPatientManagementDomainCommand){
        if (action.domain !== this.domain) { return }

        // an 'if' block casts the action. 
        if (action.type === "IO_PATIENT_DELETEITEM") {

            const fetchSaga = new FetchExampleSaga()
            yield fetchSaga.testIp(FetchExampleCommands.fetchIp())

            const event: IoDatabaseEvent = yield call((command: IoDatabaseCommand) => this.databaseWorker.post(this.tableName, command), { 
                id: action.id,
                type: "IO_DELETE_PATIENT",
            } as IoDatabaseCommand)

            if (event.type === "IO_PATIENT_DELETED") {
                yield put( {
                    domain: this.domain,
                    id: event.id,
                    type: "IO_PATIENT_DELETED"
                } as IoPatientManagementDomainEvent)

                yield put(AggregationCommands.buildBroker())
            }
        }  
    }

    private *loadItems(action: IoPatientManagementDomainCommand){
        if (action.type === "IO_PATIENT_LOADITEMS") {
            const event: IoDatabaseEvent = yield call((command: IoDatabaseCommand) => this.databaseWorker.post(this.tableName, command), { 
                type: "IO_LOAD_DATA",
            } )

            if (event.type === "IO_DATA_LOADED") {
                if (event.items){
                    yield put( {
                        domain: this.domain,
                        items: event.items ? event.items : [],
                        type: "IO_PATIENT_ITEMSLOADED",
                    } as IoPatientManagementDomainEvent)
                } else {
                    yield put( {
                        domain: this.domain,
                        items: [],
                        type: "IO_PATIENT_ITEMSLOADED",
                    } as IoPatientManagementDomainEvent)
                }
            }
        }  
    }
}

