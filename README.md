# jscommon
Reusable javascript. This should be used as submodules for other projects. 

## Usage
This repository should be created as a submodule of your React-Typescript project.
Run the followign command from the root of your webapp. 

    git submodule add 'https://github.com/psgivens/jscommon' src/jscommon

This submodule expects domain information to be profided in a file at `src/data/CrudlDomains.ts`. Define `CrudlTablename` to represent the tables you would like to create in the database. Define `CrudlDomainValues` as the values you would like those domains to be represented throughout your code. Define `CrudlDatabaseCommand` as equivalent to `CrudlDatabaseCommandBase` and `CrudlDatabaseEvent` as equivalent to `CrudlDatabaseEventBase`. An example from the opioid project is this:


    export type CrudlTableName = 
        "CountyHealthData" 
        | "SubstanceAbuseData" 
        | "CourtData" 
        | "SocialServicesData"
        | "HonestBrokerData"
        | "HealthCareReport"
        | "SubstanceAbuseReport"

    export type CrudlDomainValues = 
        "CountyHealth" 
        | "SubstanceData" 
        | "CourtData" 
        | "SocialServices"
        | "HonestBroker"
        | "Researcher"
        | "HealthCare"

    # These are not real examples. They demonstrate how to extend the message 
    # passing to handle any type of event you can dream up. These commands 
    # can be sent, and received, from your custom Saga.
    export type CrudlDatabaseCommand = CrudlDatabaseCommandBase | {
        type: "Follow_Your_Heart"
    }        
    export type CrudlDatabaseEvent = CrudlDatabaseEventBase | {
        type: "Heart_Followed"
    }

This module also expects the reducers & state to be defined in 
`src/reducers/index.ts`. The defaut container `CrudlContainer.ts` expects a 
state object called `All`.  

    import { combineReducers } from 'redux'
    import { crudlReducer, IoPatientManagementState } from 'src/jscommon/reducers/ioPatientManagementReducers'

    export type All = {} & {
        substance: IoPatientManagementState,
        county: IoPatientManagementState,
        court: IoPatientManagementState,
        honestBroker: IoPatientManagementState,
        healthCare: IoPatientManagementState,
        socialServices: IoPatientManagementState,
        researchers: IoPatientManagementState
    }  

    export const reducers = combineReducers({
        county: crudlReducer("CountyHealth"),
        court: crudlReducer("CourtData"),
        healthCare: crudlReducer("HealthCare"),
        honestBroker: crudlReducer("HonestBroker"),
        researchers: crudlReducer("Researcher"),
        socialServices: crudlReducer("SocialServices"),
        substance: crudlReducer("SubstanceData"),
    })



The final step is to define how your database will interact with the database. Copy `src/jscommon/data/CrudlDataContext.ts` to `src/data/CrudlDataContext.ts` and start modifying.         
1. Set the `databaseName` to the desired name name of your indexeddb.
2. Create const variables corresponding to each of your `CrudlTableNames`
3. Modify `DBOpenRequest.onupgradeneeded` to create the tables to your specifications. 

Finally, you'll want to wire up the sagas in your project like this in index.tsx: 

    const sagaMiddleware = createSagaMiddleware()
    const store: ReduxStore<state.All> = createStore(reducers, {}, applyMiddleware(sagaMiddleware))

    // *********** Generic Patients Database Worker **************
    const ioDatabaseWorker = new IoDatabaseWorker(store.dispatch)

    /* ... other sagas omitted. */

    const socialServicesManagementSaga = new CrudlSaga(ioDatabaseWorker, "SocialServices", "SocialServicesData")
    sagaMiddleware.run(() => socialServicesManagementSaga.saga())

    const honestBrokerSaga = new CrudlSaga(ioDatabaseWorker, "HonestBroker", "HonestBrokerData")
    sagaMiddleware.run(() => honestBrokerSaga.saga())

    ReactDOM.render(
    <Provider store={store}><App /></Provider>,
    document.getElementById('root') as HTMLElement
    );
    registerServiceWorker();



