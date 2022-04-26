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

export const changeRole = async(token) => {
    client.renewToken(token)
    client.setClientRole(agoraState.role)
    // client.on("user-published", handleUserPublished);
    if(agoraState.role === 'host') {
        client.on("user-published", handleUserJoined);
        // client.on("user-joined", handleUserJoined);
        client.on("user-left", handleUserLeft);
        // create local audio and video tracks
        console.log(AgoraRTC)
        localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        localTracks.audioTrack.play();
        await client.publish(Object.values(localTracks));
        console.log("Successfully published.");
    } else {
        // client.on("user-published", handleUserJoined);
        await client.unpublish();
        client.on("user-left", handleUserLeft);
    }
}

export const join = async(appid,token, channel, uid) => {
    // create Agora client
    client.setClientRole(agoraState.role);
    console.log(agoraState.role)
    if (agoraState.role === "audience") {
        // add event listener to play remote tracks when remote user publishs.
        client.on("user-published", handleUserJoined);
        // client.on("user-joined", handleUserJoined);
        client.on("user-left", handleUserLeft);
    }
    // join the channel
     await client.join(appid, channel, token, uid);
    if (agoraState.role === "host") {

        // create local audio and video tracks
        console.log(AgoraRTC)
        localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack()
        // localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
        // play local video track
        // localTracks.audioTrack.play();
/*
        var resp = localTracks.audioTrack.play();

        if (resp!== undefined) {
            resp.then(_ => {
                localTracks.audioTrack.play()
            }).catch(error => {
                console.log('can not play the thound======//==')
            });
        }
*/
        await client.publish(Object.values(localTracks));
        console.log("Successfully published.");

        client.on("user-published", handleUserJoined);
        client.on("user-left", handleUserLeft);
    }
}

// Leave
export async function leave() {
    for (trackName in localTracks) {
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
function handleUserJoined(user, mediaType) {
    console.log('userjoined ======= agora')
    const id = user.uid;
    remoteUsers[id] = user;
    subscribe(user, mediaType);
}

// Handle user left
function handleUserLeft(user) {
    const id = user.uid;
    delete remoteUsers[id];
}