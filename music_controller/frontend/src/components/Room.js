import React, {useState, useEffect} from 'react';
import { Grid, Button, Typography } from "@material-ui/core";
import {CreateRoomPage} from './CreateRoomPage'
import {MusicPlayer} from './MusicPlayer'

export const Room =(props)=>{
    let [votesToSkip, setVotesToSkip] =useState(2)
    let [guestCanPause, toggleGuestCanPause] = useState(false)
    let [isHost, setIsHost] = useState(false)
    let [showSettings, setShowSettings] = useState(false)
    let {roomCode} = props.match.params
    let [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false)
    let [song, setSong]= useState({})
    

    const getRoomDetails=()=> {
        fetch("/api/get-room" + "?code=" + roomCode)
          .then((response) => response.json())
          .then((data) => {
           setVotesToSkip(data.votes_to_skip)
           toggleGuestCanPause(data.guest_can_pause)
             setIsHost(data.is_host)

             
          if(data.is_host){
            
               authenticateSpotify()
          }
       
          });
      }
    useEffect(getRoomDetails,[])

    const authenticateSpotify = ()=>{
      console.log('suth')
fetch('/spotify/is-authenticated').then(response => response.json()).then(data=>{
  console.log(data.status)
  setSpotifyAuthenticated(data.status)
  if(!data.status){
    fetch('/spotify/get-auth-url').then(response=> response.json()).then(data=>{
      window.location.replace(data.url)
    })
 
  }
 })
    }


    
const getCurrentSong =()=>{
  fetch('/spotify/current-song').then(response=> {
if(!response.ok){
  return {}
}else{
  return response.json()
}
  }).then(data=> setSong(data))
}


useEffect(()=>{
 let songInterval =  setInterval(getCurrentSong, 1000)
return ()=> clearInterval(songInterval)
}, [])


    const leaveButtonPressed=()=> { 
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        };
        fetch("/api/leave-room", requestOptions).then((_response) => {
          props.exitRoom();
          props.history.push("/");
        });
      }

      const renderSettingsButton = ()=>{
        return (
            <Grid item xs={12} align="center">
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowSettings(true)}
              >
                Settings
              </Button>
            </Grid>
          );
      }
    if(showSettings){
        return (
            <Grid container spacing={1}>
            <Grid item xs={12} align="center">
              <CreateRoomPage
                update={true}
                votesToSkip={votesToSkip}
                guestCanPause={guestCanPause}
                roomCode={roomCode}
                updateCallback={getRoomDetails}
              />
            </Grid>
            <Grid item xs={12} align="center">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setShowSettings(false)}
              >
                Close
              </Button>
            </Grid>
          </Grid>
        )
    }
    
    return (  <Grid container spacing={1}>

    
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {roomCode}
          </Typography>
        </Grid>
        
<MusicPlayer {...song}/>
        {isHost ? renderSettingsButton() : null}
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={()=>leaveButtonPressed()}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>)
}