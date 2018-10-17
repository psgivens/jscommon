import { 
    IoDatabaseCommand,
    IoDatabaseEvent,
    IoDataTableName 
} from './IoDomainCommands'

export type IoDatabaseCommandEnvelope = {} & {
    correlationId: number
    command: IoDatabaseCommand
    tableName: IoDataTableName
}
  
export type IoDatabaseResponseEnvelope = {
    type:"ERROR"
    correlationId: number
    error: any
} | {
    type: "EVENT"
    correlationId: number
    event: IoDatabaseEvent
}
  
export const execOnDatabase = (cmdenv:IoDatabaseCommandEnvelope,callback:(result:IoDatabaseResponseEnvelope)=>void): void  => {
    const datasourceTableName = cmdenv.tableName
    const handleException1 = (msg:string) => (error:any):void => {
        callback({
            correlationId: cmdenv.correlationId,

            // https://stackoverflow.com/questions/44815172/log-shows-error-object-istrustedtrue-instead-of-actual-error-data
            error: msg + (JSON.stringify(error, ["message", "arguments", "type", "name"])),
            type: "ERROR",
            })
        }

    const raiseEvent1 = (event:IoDatabaseEvent) => {
        callback({
        correlationId: cmdenv.correlationId,
        event,
        type: "EVENT"})
        }

    // **************************************************************
    // Custom database code beyond this point
    //
    // In any other language, this would be moved to a separate file.
    // **************************************************************

    const databaseName = "IODINE"
    
    const tableHealthData: IoDataTableName = "CountyHealthData"
    const tableSocialData: IoDataTableName = "SocialServicesData"
    const tableCourtData:  IoDataTableName = "CourtData"
    const tableSubstanceData: IoDataTableName = "SubstanceAbuseData"
    const tableHealthProvider: IoDataTableName = "HealthCareReport"
    const tableSubstanceAbuseReport: IoDataTableName = "SubstanceAbuseReport"
    const tableHonestBroker: IoDataTableName = "HonestBrokerData"

    const handleDatabaseCommand = (
        command:IoDatabaseCommand, 
        raiseEvent:((event:IoDatabaseEvent)=>void),
        handleException:( (msg:string) =>((error:any)=>void) ) 
        ) => {
        const DBOpenRequest = indexedDB.open(databaseName, 1)
        DBOpenRequest.onerror = handleException("DBOpenRequest")

        let objectStore: IDBObjectStore
        DBOpenRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const database: IDBDatabase = DBOpenRequest.result;

            if (event.oldVersion < 1){
                // autoIncrement: there are no examples or documentation to get us the generated id
                // autoIncrement: there is no way to delete the id field so that the database will generate it
                objectStore = database.createObjectStore(tableHealthData, { keyPath: "id", autoIncrement: true });
                objectStore.createIndex("idIdx", "id", { unique: true })
                
                objectStore = database.createObjectStore(tableSubstanceData, { keyPath: "id", autoIncrement: true });
                objectStore.createIndex("idIdx", "id", { unique: true })

                objectStore = database.createObjectStore(tableCourtData, { keyPath: "id", autoIncrement: true });
                objectStore.createIndex("idIdx", "id", { unique: true })

                objectStore = database.createObjectStore(tableSocialData, { keyPath: "id", autoIncrement: true });
                objectStore.createIndex("idIdx", "id", { unique: true })

                objectStore = database.createObjectStore(tableHealthProvider, { keyPath: "id", autoIncrement: true });
                objectStore.createIndex("idIdx", "id", { unique: true })

                objectStore = database.createObjectStore(tableSubstanceAbuseReport, { keyPath: "id", autoIncrement: true });
                objectStore.createIndex("idIdx", "id", { unique: true })

                objectStore = database.createObjectStore(tableHonestBroker, { keyPath: "id", autoIncrement: true });
                objectStore.createIndex("idIdx", "id", { unique: true })                
            }
        };

    let db:IDBDatabase
    DBOpenRequest.onsuccess = (dbOpenEvent: Event) => {
        // store the result of opening the database in the db variable. This is used a lot below
        db = DBOpenRequest.result;

        // Run the displayData() function to populate the task list with all the to-do list data already in the IDB
        const transaction: IDBTransaction = db.transaction([datasourceTableName], "readwrite");
        transaction.onerror = handleException("transaction")
        transaction.oncomplete = () => {
            // console.log("**DB** transaction.oncomplete")
        };

        objectStore = transaction.objectStore(datasourceTableName);

        switch(command.type){
            case "IO_LOAD_BATCH": 
                const items = command.items

                items.forEach(i => {
                    if (i.id === 0) {
                        i.id = Math.ceil(Math.random() * 100000)
                    }
                    const objectStorePutRequest1: IDBRequest = objectStore.put(i)
                    objectStorePutRequest1.onerror = handleException("objectStoreRequest.onerror")
                    objectStorePutRequest1.onsuccess = (event:any) => {
                        // raiseEvent({type: "IO_PATIENT_INSERTED", item: i })
                    }
                })

                const allItems1: IDBRequest = db.transaction(datasourceTableName).objectStore(datasourceTableName).getAll()
                allItems1.onsuccess = (event:any) => {                
                    raiseEvent({ type: "IO_DATA_LOADED", items:event.target.result })
                }

                break

            case "IO_INSERT_PATIENT":

                if (command.item.id === 0) {
                    command.item.id = Math.ceil(Math.random() * 100000)
                }
                const objectStorePutRequest: IDBRequest = objectStore.put(command.item)
                objectStorePutRequest.onerror = handleException("objectStoreRequest.onerror")
                objectStorePutRequest.onsuccess = (event:any) => {
                    raiseEvent({type: "IO_PATIENT_INSERTED", item: command.item })
                }
                
                break

            case "IO_DELETE_PATIENT":
                if (command.id === 0) {
                    break
                }
                const objectStoreDeleteRequest: IDBRequest = objectStore.delete(command.id)
                objectStoreDeleteRequest.onerror = handleException("objectStoreRequest.onerror")
                objectStoreDeleteRequest.onsuccess = (event:any) => {
                    raiseEvent({type: "IO_PATIENT_DELETED", id: command.id })
               }

                    break

              case "IO_LOAD_DATA":
                const allItems: IDBRequest = db.transaction(datasourceTableName).objectStore(datasourceTableName).getAll()
                allItems.onsuccess = (event:any) => {                
                    raiseEvent({ type: "IO_DATA_LOADED", items:event.target.result })
                }

                //   const index: IDBIndex = db.transaction(datasourceTableName).objectStore(datasourceTableName).index("titleIdx")
                //   const boundKeyRange: IDBKeyRange = IDBKeyRange.bound("andy", "zed", false, true);

                //   // const index: IDBIndex = db.transaction("Pomodoros").objectStore("Pomodoros").index("startIdx")
                //   // const boundKeyRange: IDBKeyRange = IDBKeyRange.bound(new Date("2010-03-25T12:00:00Z"), new Date("2020-03-25T12:00:00Z"), false, true);

                //   const items:QueryDatasourceIdb[] = []
                //   index.openCursor(boundKeyRange).onsuccess = (event: any) => {
                //       const cursor = event.target.result;
                //       if (cursor) {
                //           items.push(cursor.value)
                //           cursor.continue();
                //       }
                //       else {
                //           raiseEvent({ type: "DATA_LOADED", datasources:items })
                //       }
                //   };
                  break
          };
      }
    }

    // **************************************************************
    // End of custom code.
    // **************************************************************

    try {
      handleDatabaseCommand(cmdenv.command, raiseEvent1, handleException1)
    }
    catch (e) {
        handleException1("main body")(e)
    }
  }





  