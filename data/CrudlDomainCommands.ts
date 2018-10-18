import { CrudlDomainValues } from 'src/core/data/CrudlDomains'

export type CrudlEntity = {} & {
    id: number
}

export type DomainTypes = {} & {
    domain: CrudlDomainValues
} 

export type CrudlDatabaseCommandBase = {
    type: "CRUDL_LOAD_DATA"
  } | {
    type: "CRUDL_INSERT_ITEM"
    item: CrudlEntity
  } | {
    type: "CRUDL_DELETE_ITEM"
    id: number
  } | {
    type: "CRUDL_LOAD_BATCH"
    items: CrudlEntity[]
  }
  
export type CrudlDatabaseEventBase = {
    type: "CRUDL_DATA_LOADED"
    items: CrudlEntity[]
} | {
    type: "CRUDL_ITEM_INSERTED"
    item: CrudlEntity
} | {
    type: "CRUDL_ITEM_DELETED"
    id: number
} | {
    type: "CRUDL_DATABASE_ERROR"
    error: any
}
  