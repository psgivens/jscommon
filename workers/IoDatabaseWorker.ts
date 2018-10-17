import { Dispatch } from 'redux'
import { createWorker, ITypedWorker } from 'typed-web-workers'
import { execOnDatabase, IoDatabaseCommandEnvelope, IoDatabaseResponseEnvelope } from '../data/IoDataContext'
import { IoDatabaseCommand, IoDatabaseEvent, IoDataTableName } from '../data/IoDomainCommands'

type PromiseBack = {} & {
  resolve: (event:IoDatabaseEvent) => void
  reject: (error:any) => void
}
const promiseBacks: { [index:number]: PromiseBack } = {}

export type HandleDatabaseCommand = {} & {}

export class IoDatabaseWorker {
  private dispatch : Dispatch<any>
  private databaseWorker: ITypedWorker<IoDatabaseCommandEnvelope, IoDatabaseResponseEnvelope>
  constructor(dispatch: Dispatch<any>){
    this.dispatch = dispatch
    this.databaseWorker = createWorker(
      execOnDatabase, this.execOnUI)    
  }

  public post (tableName: IoDataTableName, command:IoDatabaseCommand): Promise<IoDatabaseEvent> {
    const correlationId = Math.floor(Math.random() * 1000000000000000)
    const cmdenv:IoDatabaseCommandEnvelope = { command, correlationId, tableName }
    const promise = new Promise<IoDatabaseEvent>((resolve,reject) => {
      promiseBacks[cmdenv.correlationId] = { reject, resolve }
      this.databaseWorker.postMessage(cmdenv)
    })
    return promise
  }

  private execOnUI (evtenv:IoDatabaseResponseEnvelope):void {
    if (evtenv.correlationId in promiseBacks) {
      const promiseBack = promiseBacks[evtenv.correlationId]
      delete promiseBacks[evtenv.correlationId]
      switch(evtenv.type){
        case "ERROR":
          promiseBack.reject(evtenv.error)
          break
        default:
          promiseBack.resolve(evtenv.event)
          break
      }
      // tslint:disable-next-line:no-console
      console.log("execOnUI: " + JSON.stringify(evtenv))
    } else if (evtenv.type === "EVENT") {
      this.dispatch(evtenv.event)
    } else {
      this.dispatch(evtenv.error)
    }
  }

}