import { IoPatientManagementDomainEvent } from 'src/jscommon/actions/IoPatientManagementSaga'
import { DomainValues, IoEntity } from 'src/jscommon/data/IoDomainCommands'

export type IoPatientManagementState = {} & {
    items: IoEntity[]
    editingItem: IoEntity | void
    selectedItem: IoEntity | void    
}

export const createInitialState = (): IoPatientManagementState => ({ 
    editingItem: undefined,
    items: [],  
    selectedItem: undefined,
})

const initialState:IoPatientManagementState = createInitialState()
export const ioPatientManagementReducer = (domain:DomainValues) => 
    (state:IoPatientManagementState = initialState, action: IoPatientManagementDomainEvent): IoPatientManagementState =>   
    {
        if (action.domain !== domain) { return state }
        
        switch(action.type) {
            case "IO_PATIENT_ITEMSLOADED":
                return { ...state, items: action.items}
            case "IO_PATIENT_ITEMSELECTED":
                return {...state, selectedItem: action.item}
            case "IO_PATIENT_ITEMADDED": 
                const item = action.item
                const items1 = state.items
                const addedId = item.id
                return { ...state, items:[
                    ...items1.filter(ds => ds.id !== addedId), action.item]}
            case "IO_PATIENT_DELETED":
                const items2 = state.items
                const deleteId = action.id
                return { ...state, items:[
                    ...items2.filter(ds => ds.id !== deleteId)]}    
            default:
                return state
        }
    }

