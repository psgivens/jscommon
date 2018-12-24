import { CrudlDatabaseCommand, CrudlDatabaseEvent, CrudlTableName } from 'src/core/data/CrudlDomains';
import { CrudlDatabaseWorker } from './CrudlDatabaseWorker';

export type CrudlPost = (command:CrudlDatabaseCommand) => Promise<CrudlDatabaseEvent>

export class CrudlDatabaseTableWorker {
    constructor(
        private database:CrudlDatabaseWorker,
        private tableName: CrudlTableName){
        this.post = this.post.bind(this)
    }
    public post(command:CrudlDatabaseCommand): Promise<CrudlDatabaseEvent> {
        return this.database.post(this.tableName, command)
    }
}