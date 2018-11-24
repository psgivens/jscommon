
import { connect } from 'react-redux';
import * as redux from 'redux';
import * as state from 'src/core/reducers/index';

export type AttributeProps = {} & {    
    component: any
    path:string        
}
  
export type StateProps = {} & {
    isAuthenticated?: boolean
}
  
export type ConnectedDispatch = {} & {
}


const mapStateToProps = (state1: state.All, ownProps: AttributeProps): StateProps => {
    return {
        isAuthenticated: state1.auth.isAuthenticated
    } }

const mapDispatchToProps = (dispatch: redux.Dispatch<any>): ConnectedDispatch => {
    return {
    }
}    

export const connectContainer = 
    connect<{}, {}, AttributeProps>(mapStateToProps, mapDispatchToProps)
  
