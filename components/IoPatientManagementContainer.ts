import { connect } from 'react-redux';
import * as redux from 'redux';
import { createIoPatientManagementCommands, IoPatientManagementCommand } from 'src/jscommon/actions/IoPatientManagementSaga'
import { DomainValues, IoEntity } from 'src/jscommon/data/IoDomainCommands'
import { IoPatientManagementState } from 'src/jscommon/reducers/ioPatientManagementReducers';
import * as state from 'src/reducers/index'

export type AttributeProps = {} & {
    name: string
}
  
export type StateProps<T extends IoEntity> = {} & {
    items: T[]
    item: T | void
}
  
export type ConnectedDispatch<T extends IoEntity> = {} & {
    selectItem?: (item: T) => void
    addItem?: (item: T) => void
    deleteItem?: (id: number) => void
    loadItems?: () => void
}

export type SelectSubState = (s:state.All)=>IoPatientManagementState
export const connectContainer = <T extends IoEntity, U>(domain:DomainValues, component: any, select:SelectSubState) => {

    const mapStateToProps = (state1: state.All, ownProps: AttributeProps): StateProps <T> => {
        const ios = select(state1)        
        return {
            item: ios.selectedItem as T,
            items: ios.items as T[]
        } }
    
    const mapDispatchToProps = (dispatch: redux.Dispatch<IoPatientManagementCommand>): ConnectedDispatch<T> => {
        const commands = createIoPatientManagementCommands(domain)
        return {
            addItem: (item:T) => dispatch(commands.addItem(item)),
            deleteItem: (id: number) => dispatch(commands.deleteItem(id)),
            loadItems: () => dispatch(commands.loadItems()),
            selectItem: (item:T) => dispatch(commands.selectItem(item))
        }
    }    

    return connect<{}, {}, AttributeProps>( 
        (s: state.All,o:AttributeProps) => mapStateToProps(s,o), 
        (dispatch: redux.Dispatch<IoPatientManagementCommand>) => mapDispatchToProps(dispatch)) 
        (component)
} 

