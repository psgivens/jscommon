import { connect } from 'react-redux';
import * as redux from 'redux';

import { PingCommand, PingCommands } from 'src/jscommon/actions/PingSaga'

import * as state from 'src/core/reducers/index';

import { PingState } from 'src/jscommon/reducers/PingReducers'

export type AttributeProps = {} & {    
}
  
export type StateProps = {} & {
    pingState: PingState
}
  
export type ConnectedDispatch = {} & {
    getIp?:() => void
}


const mapStateToProps = (state1: state.All, ownProps: AttributeProps): StateProps => {
    return {
        pingState: state1.ping
    } }

const mapDispatchToProps = (dispatch: redux.Dispatch<PingCommand>): ConnectedDispatch => {
    return {
        getIp: () => dispatch(PingCommands.pingForIp())
    }
}    

export const connectContainer = 
    connect<{}, {}, AttributeProps>(mapStateToProps, mapDispatchToProps)
  
