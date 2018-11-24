
import * as React from 'react'
import { Redirect, Route } from 'react-router-dom';
import * as container from './protectedRoute/protectedRouteContainer'


type ThisProps = 
  container.StateProps
  & container.ConnectedDispatch
  & container.AttributeProps

const ProtectedRoute: React.SFC<ThisProps> = ( {component:Component, isAuthenticated, ...rest }: ThisProps ) => {
  const redirect = (location:string) => (   
    <Redirect
      to={{
        pathname: "/login",
        state: { from: location }
      }} />)

  const checkRedirect = (props:any) => 
    isAuthenticated 
      ? (<Component {...props} />) 
      : redirect(props.location)

  return (<Route {...rest} render={checkRedirect} />)
}

export default container.connectContainer(ProtectedRoute)


