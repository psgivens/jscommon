import { call, put, takeEvery } from 'redux-saga/effects'
import { CrudlDatabaseCommand, CrudlDatabaseEvent, CrudlDomainValues } from 'src/core/data/CrudlDomains'
import { CrudlEntity, DomainTypes} from '../data/CrudlDomainCommands'
import { CrudlPost } from '../workers/CrudlDatabaseTableWorker';

export type CrudlSagaCommand = {
    type: "IO_PATIENT_LOADITEMS"
} | {
    type: "IO_PATIENT_ADDITEM"
    item: CrudlEntity
} | {
    type: "IO_PATIENT_DELETEITEM"
    id: number
} | {
    type: "IO_PATIENT_SELECTITEM"
    item: CrudlEntity
} 

export type CrudlSagaEvent = {
    type: "CRUDL_ITEMSLOADED"
    items: CrudlEntity[]
} | {
    type: "CRUDL_ITEMLOADED"    
    item: CrudlEntity
} | {
    type: "CRUDL_ITEM_DELETED"    
    id: number
} | {
    type: "CRUDL_IP_FAILED"
} | {
    type: "CRUDL_ITEMSELECTED"
    item: CrudlEntity
} 

export type CrudlSagaDomainEvent = 
    CrudlSagaEvent & DomainTypes

export type CrudlSagaDomainCommand =
    CrudlSagaCommand & DomainTypes

export function createCrudlDomainSagaCommands (domain:CrudlDomainValues) {
    return {
    addItem: (item: CrudlEntity): CrudlSagaDomainCommand => ({ domain, type: "IO_PATIENT_ADDITEM", item }),
    deleteItem: (id: number): CrudlSagaDomainCommand => ({ domain, type: "IO_PATIENT_DELETEITEM", id }),
    loadItems: ():CrudlSagaDomainCommand => ({ domain, type: "IO_PATIENT_LOADITEMS" }),
    selectItem: (item: CrudlEntity):CrudlSagaDomainCommand => ({ domain, type: "IO_PATIENT_SELECTITEM", item })
} }


/************************ SAGA *********************/

export type CrudlCallbacks = {} & {
    onPutItemAdded: ((event: CrudlSagaDomainEvent) => IterableIterator<any>) | void
    onPutItemDeleted: ((event: CrudlSagaDomainEvent) => IterableIterator<any>) | void
}

export class CrudlSaga {
    private callbacks: CrudlCallbacks
    constructor (
            // private databaseWorker:CrudlDatabaseWorker, 
            private crudlPost: CrudlPost,
            private domain: CrudlDomainValues) {

        this.saga = this.saga.bind(this)
        this.addItem = this.addItem.bind(this)
        this.loadItems = this.loadItems.bind(this)
        this.selectItem = this.selectItem.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        
        this.putItemAdded = this.putItemAdded.bind(this)
        this.putItemDeleted = this.putItemDeleted.bind(this)
    }
    
    /*************** Register listeners ********************/
    public *saga(): Iterator<any> {
        yield takeEvery('IO_PATIENT_SELECTITEM', this.selectItem)
        yield takeEvery('IO_PATIENT_ADDITEM', this.addItem)
        yield takeEvery('IO_PATIENT_DELETEITEM', this.deleteItem)
        yield takeEvery('IO_PATIENT_LOADITEMS', this.loadItems)
    }

    protected init(callbacks: CrudlCallbacks){
        this.callbacks = callbacks
    }
    
    private *putItemAdded(event: CrudlSagaDomainEvent){
        yield put(event)
        if (this.callbacks && this.callbacks.onPutItemAdded) { 
            yield this.callbacks.onPutItemAdded(event)
        }
    }

    private *putItemDeleted(event: CrudlSagaDomainEvent){
        yield put(event)
        if (this.callbacks && this.callbacks.onPutItemDeleted) { 
            yield this.callbacks.onPutItemDeleted(event)
        }
    }

    private *selectItem(action: CrudlSagaDomainCommand){
        if (action.domain !== this.domain) { return }

        // an 'if' block casts the action. 
        if (action.type === "IO_PATIENT_SELECTITEM") {
            yield put( {
                domain: this.domain,
                item: action.item,
                type: "CRUDL_ITEMSELECTED"
            } as CrudlSagaDomainEvent)
        }
    }

    private *addItem(action: CrudlSagaDomainCommand){
        if (action.domain !== this.domain) { return }

        // an 'if' block casts the action. 
        if (action.type === "IO_PATIENT_ADDITEM") {

            const event: CrudlDatabaseEvent = yield call((command: CrudlDatabaseCommand) => this.crudlPost(command), { 
                item:action.item,
                type: "CRUDL_INSERT_ITEM",
            } as CrudlDatabaseCommand)

            if (event.type === "CRUDL_ITEM_INSERTED") {
                yield this.putItemAdded( {
                    domain: this.domain,
                    item: event.item,
                    type: "CRUDL_ITEMLOADED"
                })
            }
        }
    }

    private *deleteItem(action: CrudlSagaDomainCommand){
        if (action.domain !== this.domain) { return }

        // an 'if' block casts the action. 
        if (action.type === "IO_PATIENT_DELETEITEM") {

            const event: CrudlDatabaseEvent = yield call((command: CrudlDatabaseCommand) => this.crudlPost(command), { 
                id: action.id,
                type: "CRUDL_DELETE_ITEM",
            } as CrudlDatabaseCommand)

            if (event.type === "CRUDL_ITEM_DELETED") {
                yield this.putItemDeleted( {
                    domain: this.domain,
                    id: event.id,
                    type: "CRUDL_ITEM_DELETED"
                })
            }
        }  
    }

    private *loadItems(action: CrudlSagaDomainCommand){
        if (action.type === "IO_PATIENT_LOADITEMS") {
            const event: CrudlDatabaseEvent = yield call((command: CrudlDatabaseCommand) => this.crudlPost(command), { 
                type: "CRUDL_LOAD_DATA",
            } )

            if (event.type === "CRUDL_DATA_LOADED") {
                if (event.items){
                    yield put( {
                        domain: this.domain,
                        items: event.items ? event.items : [],
                        type: "CRUDL_ITEMSLOADED",
                    } as CrudlSagaDomainEvent)
                } else {
                    yield put( {
                        domain: this.domain,
                        items: [],
                        type: "CRUDL_ITEMSLOADED",
                    } as CrudlSagaDomainEvent)
                }
            }
        }  
    }
}

