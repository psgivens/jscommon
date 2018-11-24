
import * as React from 'react'
import Button from 'src/jscommon/controls/Button'
import * as container from './pingComponent/pingComponentContainer'

import { connectContainer } from './pingComponent/pingComponentContainer'

type ThisProps = 
  container.StateProps
  & container.ConnectedDispatch
  & container.AttributeProps


/*************** TODO Remove *******************/
const SecondStyle = {
  backgroundColor: "green"
}

/*************** end Remove *******************/

// TODO: Add error-boundaries
// https://reactjs.org/docs/error-boundaries.html

type ComponentState = {} & {
}

class PingComponent extends React.Component<ThisProps, ComponentState> {
constructor (props:ThisProps) {
  super (props)
  this.state = { }
  this.onGetIPPressed = this.onGetIPPressed.bind(this)
  this.onPingGetStringsPressed = this.onPingGetStringsPressed.bind(this)
  this.onPingGetDtoPressed = this.onPingGetDtoPressed.bind(this)
}

  public render () {
    
  return (<div className="container-fluid" >
    <section className="hero is-primary">
      <div className="hero-body" style={SecondStyle}>
        <p className="title" style={SecondStyle}>
          Pomodoro Management
        </p>
        <p className="subtitle">
          List and edit <strong>Pomodoros</strong>
        </p>
      </div>
    </section>    
    <section className="section">
      <table className="table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>IP</td>
            <td>{this.props.pingState.ip}</td>
          </tr>
          <tr>
            <td>DTO</td>
            <td>{JSON.stringify(this.props.pingState.dto)}</td>
          </tr>
          <tr>
            <td>Strings</td>
            <td>{JSON.stringify(this.props.pingState.values)}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <section className="section" >
      <div className="Data-entry" >
        <Button onClick={this.onGetIPPressed} text="Get IP" />
        <Button onClick={this.onPingGetStringsPressed} text="GET ping" />
        <Button onClick={this.onPingGetDtoPressed} text="GET ping DTO" />
      </div>
    </section>
  </div>)
  }
  private onGetIPPressed (event: React.SyntheticEvent<HTMLButtonElement>) {
    event.preventDefault()
    this.props.getIp!()
  }
  private onPingGetStringsPressed (event: React.SyntheticEvent<HTMLButtonElement>) {
    event.preventDefault()
    this.props.pingGetStrings!()
  }
  private onPingGetDtoPressed (event: React.SyntheticEvent<HTMLButtonElement>) {
    event.preventDefault()
    this.props.pingGetDto!()
  }
}

// Export the react component
export default connectContainer(PingComponent)


