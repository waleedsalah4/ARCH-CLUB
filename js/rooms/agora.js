import { changeMutestate, Me, changeVolumesIndicator } from "./room.js";

export let client = AgoraRTC.createClient({
    mode: "live",
    codec: "vp8"
});

// for record
let audioTracks = []
let recording = false;
let ac = new AudioContext();
let sources=[];
let dest ;
//-----
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
    await client.leave();
    join(roomInfo.appid,token, roomInfo.channelName,roomInfo.uid) 
    
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
 
        console.log(localTracks.audioTrack.getMediaStreamTrack())
        audioTracks.push(localTracks.audioTrack.getMediaStreamTrack())
        if (ac.state === 'suspended') {
            ac.resume();
        }
        console.log('audio tracks after adding media track', audioTracks)


        await client.publish(Object.values(localTracks));
        // audioTracks.push(localTracks.audioTrack.getMediaStreamTrack())
        // if (ac.state === 'suspended') {
        //     ac.resume();
        // }
        console.log("Successfully published.");
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
        // console.log("unpublished audio:=====>", evt);
      
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
        // await localTracks.audioTrack.setEnabled(true)
        await localTracks.audioTrack.setMuted(false)
        console.log(' un muted ===>')
    } else{
        // await localTracks.audioTrack.setEnabled(false)
        await localTracks.audioTrack.setMuted(true)
        console.log(' muted ===>')
    }
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
    console.log('userleft==>', audioTracks)
}

// Subscribe to a remote user

async function subscribe(user, mediaType) {
    // const uid = user.uid;
    // await client.subscribe(user, mediaType)
    await client.subscribe(user,"audio");
    user.audioTrack.play();


    if(recording){
        sources.push(ac.createMediaStreamSource(new MediaStream([user.audioTrack.getMediaStreamTrack()])))
        sources[sources.length-1].connect(dest)
    } else{
        audioTracks.push(user.audioTrack.getMediaStreamTrack());
    }
    console.log('AudioTracks ======>',audioTracks)
    console.log("Successfully subscribed.");
    // if (mediaType === 'audio') {
    //     user.audioTrack.play();
    // }
}

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
    // audioTracks=audioTracks.filter(audioTrack => audioTrack.uid !== user.uid)
    console.log('userLeft ===> ', audioTracks)
    const id = user.uid;
    delete remoteUsers[id];
}

export let recorder;
let chunks = [];

export function startRecording(roomName){
    recording = true
// WebAudio MediaStream sources only use the first track.
    console.log('AudioTracks ======>',audioTracks)

    // The destination will output one track of mixed audio.
    dest = ac.createMediaStreamDestination();

    sources = audioTracks.map(t => ac.createMediaStreamSource(new MediaStream([t])));
    // Mixing
    sources.forEach(s => s.connect(dest));

    // Record 10s of mixed audio as an example
    recorder = new MediaRecorder(dest.stream);
    recorder.start();
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
        // var clipName = prompt("Enter a name for your recording")
        const blob = new Blob(chunks, {
            type: 'audio/mp3'
        })
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none"
        a.href = url;
        a.download = roomName +".mp3"
        document.body.appendChild(a)
        a.click();
        setTimeout(()=>{
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        }, 100)
    };
    // setTimeout(() => recorder.stop(), 10000);
}