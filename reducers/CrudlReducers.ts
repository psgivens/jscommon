import { CrudlDomainValues } from 'src/core/data/CrudlDomains'
import { CrudlSagaDomainEvent } from 'src/jscommon/actions/CrudlSaga'
import { CrudlEntity } from 'src/jscommon/data/CrudlDomainCommands'

export type CrudlState = {} & {
    items: CrudlEntity[]
    editingItem: CrudlEntity | void
    selectedItem: CrudlEntity | void    
}

export const createInitialState = (): CrudlState => ({ 
    editingItem: undefined,
    items: [],  
    selectedItem: undefined,
})

const initialState:CrudlState = createInitialState()
export const crudlReducer = (domain:CrudlDomainValues) => 
    (state:CrudlState = initialState, action: CrudlSagaDomainEvent): CrudlState =>   
    {
        if (action.domain !== domain) { return state }
        
        switch(action.type) {
            case "CRUDL_ITEMSLOADED":
                return { ...state, items: action.items}
            case "CRUDL_ITEMSELECTED":
                return {...state, selectedItem: action.item}
            case "CRUDL_ITEMLOADED": 
                const item = action.item
                const items1 = state.items
                const addedId = item.id
                return { ...state, items:[
                    ...items1.filter(ds => ds.id !== addedId), action.item]}
            case "CRUDL_ITEM_DELETED":
                const items2 = state.items
                const deleteId = action.id
                return { ...state, items:[
                    ...items2.filter(ds => ds.id !== deleteId)]}    
            default:
                return state
        }
    }

