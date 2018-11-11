import { PingEvent } from 'src/jscommon/actions/PingSaga'

export type PingState = {} & {
    ip: string
    values: string[]
    dto: any
}

export const createInitialState = (): PingState => ({ 
    dto: {},
    ip: "",
    values: []
})

const initialState:PingState = createInitialState()
export const pingReducer = (state:PingState = initialState, action: PingEvent): PingState =>   
    {
        switch(action.type) {
            case "PING_FAILED":
                return createInitialState()
            case "PING_NETWORK_FOR_IP_SUCCESS":
                return {...(createInitialState()), ip:action.ip}
            case "PING_SUCCESS_DTO":
                return {...(createInitialState()), dto:action.dto}
            case "PING_SUCCESS_STRINGS":
                return {...(createInitialState()), dto:action.values}
        }
        return state
    }

