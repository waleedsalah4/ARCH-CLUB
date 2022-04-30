import { changeMutestate, Me, changeVolumesIndicator } from "./room.js";

export let client = AgoraRTC.createClient({
    mode: "live",
    codec: "vp8"
});


var localTracks = {
    audioTrack: null
};
var remoteUsers = {};
// Agora client options
export let agoraState = {
    role: 'audience'
}

let roomInfo = {}

export const changeRole = async(token) => {

    // client.renewToken(token)
    // await client.unpublish();
    // client.setClientRole(agoraState.role)
    await client.leave();
    join(roomInfo.appid,token, roomInfo.channelName,roomInfo.uid) 
    /*
    client.setClientRole(agoraState.role, function() {
        console.log(`Client role set to ${agoraState.role}`);
      }, function(e) {
        console.log('setClientRole failed', e);
      });
    //   await client.join(appid, channel, token, uid);
    console.log(roomInfo)
    
    await  client.join(roomInfo.appid, roomInfo.channelName, token,roomInfo.uid) 
        if(agoraState.role === 'host'){
            localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            await client.publish(Object.values(localTracks));
        }
          console.log('User join channel successfully');
*/
    


/*
    // client.on("user-published", handleUserPublished);
    if(agoraState.role === 'host') {
        // client.on("user-published", handleUserJoined);
        // client.on("user-left", handleUserLeft);
        // create local audio and video tracks
        // console.log(AgoraRTC)
        localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        // localTracks.audioTrack.play();
        await client.publish(Object.values(localTracks));
        console.log("Successfully published.");
    } else {
        // client.on("user-published", handleUserJoined);
        // await client.unpublish();
        // client.on("user-left", handleUserLeft);
        console.log('changed to audience in agora===================')
    }*/
}

export const join = async(appid,token, channel, uid) => {
    // create Agora client
    roomInfo.channelName = channel;
    roomInfo.appid = appid
    roomInfo.uid = uid
    console.log(roomInfo)

    client.setClientRole(agoraState.role);
    //
    client.enableAudioVolumeIndicator();
    
    console.log(agoraState.role)
    await client.join(appid, channel, token, uid);

    
    // add event listener to play remote tracks when remote user publishs.
        
    // join the channel
     if (agoraState.role === "host") {

        // create local audio and video tracks
        console.log(AgoraRTC)
        localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack()
 
        await client.publish(Object.values(localTracks));
        console.log("Successfully published.");

        // client.on("unmute-audio", function (evt) {
        //     var uid = evt.uid;
        //     console.log("unmute audio:" + uid);
        // });

        // setInterval(() => {
        //     console.log('audio details 1')
        //     client.getRemoteAudioStats((remoteAudioStatsMap) => {
        //         console.log('audio details 2')
        //       console.log("active user audio datails", remoteAudioStatsMap)
        //     });
        // }, 1000)
    }

    client.on("user-published", handleUserPublished);
    client.on("user-left", handleUserLeft);
    client.on("user-mute-updated", function(evt) {
        // var uid = evt.uid;
        console.log("mute audio:=====>" , evt);
        // alert("mute audio:" + evt);
    })
    
    client.on("user-unpublished", function(evt) {
            // var uid = evt.uid;
        console.log("unpublished audio:=====>", evt);
      
        // var muteState = evt._audio_muted_;
        changeMutestate(evt)
            // alert("mute audio:", evt);
    });

    client.on("volume-indicator", volumes => {
        changeVolumesIndicator(volumes)
    })
}

// let localTracksState = {
//     audioTrackMuted: false
// }




//mute & unmute
export async function toggleMic(isMuted = false){
  

    if (isMuted){
        await localTracks.audioTrack.setEnabled(true)
        // await client.unpublish(Object.values(localTracks));
        // localTracksState.audioTrackMuted = true;
        console.log(' un muted ===>')
        // Me.isMuted = true;
         //change footer icon
         
        //  document.getElementById('handle-mute').innerHTML = `
        //  <img src="../../assets/room/microphone-on.svg" alt="">`
 
         //change speaker icon
        //  document.querySelector('.mic').innerHTML = `
        //  <img src="../../assets/room/microphone.svg" alt="">`
    }
    
    else{
        await localTracks.audioTrack.setEnabled(false)
        

        console.log(' muted ===>')
        // Me.isMuted = false;
        //change footer icon
        // document.getElementById('handle-mute').innerHTML = `
        // <img src="../../assets/room/microphone.svg" alt="">`

        //change speaker icon
        // document.querySelector('.mic').innerHTML = `
        // <img src="../../assets/room/microphone-on.svg" alt="">`
    }
    // localTracksState.audioTrackMuted = !localTracksState.audioTrackMuted;
}



// Leave
export async function leave() {
    for (let trackName in localTracks) {
        var track = localTracks[trackName];
        if (track) {
            track.stop();
            track.close();
            localTracks[trackName] = undefined;
        }
    }
    // remove remote users and player views
    remoteUsers = {};
    // leave the channel
    console.log('user left agora*******------****--')
    await client.leave();
}

// Subscribe to a remote user

async function subscribe(user, mediaType) {
    // const uid = user.uid;
    // await client.subscribe(user, mediaType)
    await client.subscribe(user,"audio");
    user.audioTrack.play();
    console.log("Successfully subscribed.");
    // if (mediaType === 'audio') {
    //     user.audioTrack.play();
    // }
}
/*
// Handle user published
async function handleUserPublished(user, mediaType) {
    const id = user.uid;
    remoteUsers[id] = user;
    console.log("user published")
    subscribe(user, mediaType);
    // await client.subscribe(user, mediaType);
    // if (mediaType === "audio") {
    //     user.audioTrack.play();
    // }
}
*/
// Handle user joined
function handleUserPublished(user, mediaType) {
    console.log('userjoined ======= agora', user)
    changeMutestate(user)
    const id = user.uid;
    remoteUsers[id] = user;
    subscribe(user, mediaType);
}

// Handle user left
function handleUserLeft(user) {
    const id = user.uid;
    delete remoteUsers[id];
}