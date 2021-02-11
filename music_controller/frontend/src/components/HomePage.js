import React, {useState, useEffect} from 'react'
import {JoinRoomPage} from './RoomJoinPage'
import {CreateRoomPage} from './CreateRoomPage'
import {BrowserRouter as Router, Switch, Route,Link,Redirect} from 'react-router-dom'
import {Room} from "./Room";
import {RenderHome} from './renderHome'

export const HomePage = (props)=>{
let [roomCode, setRoomCode ] = useState(null)

useEffect(()=>{
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
     setRoomCode(data.code);
      });
}, [])

const exitRoom = ()=> setRoomCode(null)

    return (<Router>
        <Switch>
            <Route exact path='/' render={()=>{
                return roomCode? ( <Redirect to={`/room/${roomCode}`} />):
                (<RenderHome/>)
            }}/>
            <Route path='/join' component={JoinRoomPage} />
            <Route path='/create' component={CreateRoomPage}/>
            <Route
            path="/room/:roomCode"
            render={(props) => {
              return <Room {...props} exitRoom={exitRoom} />;
            }}
          />
           
        </Switch>
    </Router>)
}

