import { sideBarView } from '../sideBar/sideBarView.js';
import { roomSideBarHref } from '../sideBar/sideBarHref.js';
import { snackbar } from '../utilities/snackbar.js';
import {client,changeRole ,join, leave, agoraState ,toggleMic, startRecording, recorder} from './agora.js';
const roomSideBar = document.querySelector('#room-sidebar')

const roomSpeaker = document.querySelector('.room-speakers')
const roomListeners = document.querySelector('.room-listeners')
const footer = document.querySelector('.footer-control')
const modalContainer = document.querySelector('#modal-container')
const snackbarContainer = document.getElementById('snackbar-container');


var token = JSON.parse(localStorage.getItem('user-token'));

// let client = AgoraRTC.createClient({
//     mode: "live",
//     codec: "vp8",
// });

// let handleError = function(err){
//     console.log("Error: ", err);
// };


let state = {
    isAdmin: false,
    isSpeaker:false,
    isListener:false,
    isMuted: false,
    isAskedState: false
};

// let newState = {}

let roomState = {
    audience : [],
    brodcasters : [],
}; 

export let Me= {}

let socket = io('https://audiocomms-podcast-platform.herokuapp.com', {
    auth: {
        token,
    }
});

window.socket = socket;
// window.Me = Me;



const handleErrorMsg = (msg) => {
    if(msg.includes("tried to join room twice")){
        document.querySelector('.loader-container').classList.remove('show-modal')
        snackbar(snackbarContainer,'error', `<b>Error: </b> tried to join room twice`, 5000, redirectWhenRoomEnded);
    }
    if(msg.includes("active room you created")){
        
        snackbar(snackbarContainer,'error', `<b>Error: </b> cannot do this action because there is an active room you created`, 5000 );
    }
    if(msg.includes("Duplicate field value")){
        
        snackbar(snackbarContainer,'error', `<b>Error: </b>there is an active room with this name please check different name`, 5000 );
    }
    if(msg.includes("not found")){
        snackbar(snackbarContainer,'error', `<b>Error: </b>there is no room with this id`, 5000 ,redirectWhenRoomEnded);
    }
    if(msg.includes("Invalid input data")){
        snackbar(snackbarContainer,'error', `<b>Error: </b>Invalid input data. Name must be en-US alphanumeric`, 5000);
    }
}

socket.on('errorMessage', (msg) => {
    // snackbar(snackbarContainer,)
    // document.querySelector('.loader-container').classList.remove('show-modal')
    
    handleErrorMsg(msg)
    //snackbar(snackbarContainer,'error', `<b>Error: </b>  ${msg}`, 10000);
    console.log(msg)
    // handleErrorMsg(msg)
});

socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

let timerCounter=0;
socket.on('disconnect', async(reason)=>{
    
    if (reason === 'transport close' && state.isAdmin) {

        if(roomState.isRecording) {
            //stop record when admin disconnect
            await recorder.stop();
        }
        leave()//agora
        const reconnectTimer =  setInterval(()=>{
            if(socket.connected) {
                socket.emit('adminReJoinRoom')
                clearInterval(reconnectTimer)
                timerCounter = 0;
            }else{
                if(timerCounter>= 60){
                    window.location = '/archclub/home/index.html';
                }
                timerCounter+=3;
                console.log('please check your internet connection')
            }
        } , 3000) 

    } else if(reason.includes("io server disconnect")){
        snackbar(snackbarContainer,'error', `<b>Error: </b>romm ended`, 5000, redirectWhenRoomEnded);
    } else {
        
        console.log(reason)
        window.location = '/archclub/home/index.html';
    }

 })


const handleUIWhenCreateRoom = (roomName ,isRocording, status, id) => {
    document.querySelector('.create-room-container').classList.add('show-modal') 
    // document.querySelector('#create-join-container').classList.remove('show-modal')
    document.querySelector('#room-title').innerHTML = roomName
    if(isRocording) {
        startRecording(roomName)
        document.querySelector('#recordRoom-span').classList.add('record-room')
        document.querySelector('#recordRoom-span').innerHTML = '🟢';

    }
    if(status === 'private'){
        document.querySelector('.private-room').innerHTML = `
            <div>
                room id: ${id}
            </div>
        `
    }
}

socket.on('createRoomSuccess', async(user,room,token) => {
        
    // if(room){
        console.log(user,room,token)
        
        user.isMuted = false;
        user.isAdmin = true;
        Me = {...user};
        roomState.audience = room.audience;
        roomState.brodcasters = [user];
        roomState.channelName = room.name;
        roomState.appId = room.APP_ID,
        roomState.isRecording = room.isRecording;
        state.isAdmin = true;
        state.isSpeaker = true;
        console.log(state)
        renderRoom(roomState, state);

        const roomLink = `${window.location.host}/archclub/rooms/room.html?id=${room._id}`
        console.log(roomLink)

        //agora 
        // client.init(room.APP_ID);
        agoraState.role = 'host';
        await join(room.APP_ID,token,room.name,user.uid)
        handleUIWhenCreateRoom(room.name ,room.isRecording, room.status, room._id)
})

socket.on('joinRoomSuccess', (user, room, token) => {
    console.log('join room',user,room,token)
    handleUIWhenCreateRoom(room.name, room.isRecording)
    user.isMuted = false;
    room.admin.isAdmin = true;
    Me = {...user};
    state.isListener = true;
    roomState.audience = room.audience;
    roomState.brodcasters = [room.admin,...room.brodcasters];
    roomState.brodcasters.map(bro => bro.isMuted = true);
    roomState.admin = room.admin
    console.log(state)
    renderRoom(roomState, state)

    //agora
    agoraState.role = 'audience';
    join(room.APP_ID,token,room.name,user.uid)
})

socket.on('userJoined', (user) => {
    console.log('userJoined', user)
    console.log(roomState);
    user.isAsked = false;
    user.isMuted = false;
    addItem(user);
    console.log(state)
    renderRoom(roomState, state);
    playAudio('/assets/audio/userEnter.wav')
})

socket.on('userLeft', (user) => {
    console.log('user left', user)

    roomState.audience = roomState.audience.filter(usr => usr._id !== user._id)

    roomState.brodcasters = roomState.brodcasters.filter(usr => usr._id !== user._id)

    renderRoom(roomState, state)
    playAudio('/assets/audio/userLeft.wav')
})

socket.on('userAskedForPerms', (user) => {
    console.log('userAskedForPerms', user) 
    console.log('room state', roomState)
    for (let aud of roomState.audience) {
        if(aud._id === user._id){
            aud.isAsked = !aud.isAsked;
            break;
        }
    }

    renderRoom(roomState,state)
    
})

socket.on('userChangedToBrodcaster', (user)=> {
    console.log('user changed to Brodcaster', user)
    user.isAsked = false;
    // const newState = {...state}
    // state.isListener = false;
    if(user._id === Me._id){
        state.isListener = false;
        state.isSpeaker = true;
    }
   
    
    roomState.audience = roomState.audience.filter(usr => usr._id !== user._id)
    addUserToSpeakers(user)
    renderRoom(roomState, state)
    playAudio('/assets/audio/userBecomeSpeaker.wav')

    // console.log('newState',newState)
    console.log('state', state)
    roomState.userUid = user.uid;
    user._id === Me._id ? agoraState.role = 'host' : '';
    
})

socket.on('brodcasterToken', async(token)=>{
    console.log('brodcaster token when user changed from aud to brod', token)
    //only for user who asked
    // changUserToBrod(token)

    await changeRole(token)
    // join(roomState.appId,token,roomState.name,roomState.userUid)
})

socket.on('userChangedToAudience', (user)=>{
    console.log('user back to be aud', user)
    // const newState = {...state}
    // state.isListener = true;
    if(user._id === Me._id){
        state.isSpeaker = false;
        state.isListener = true;
        state.isMuted = false
    }
    roomState.brodcasters = roomState.brodcasters.filter(usr => usr._id !== user._id)
   
    addItem(user)
    renderRoom(roomState, state)
    playAudio('/assets/audio/userBecomeAudienc.wav')

    roomState.userUid = user.uid;
    // console.log('room state after change user to audience',roomState)
    // console.log('newState',newState)
    console.log('state', state)


    user._id === Me._id ? agoraState.role = 'audience' : '';
})

socket.on('audienceToken', async(token) => {
    console.log('aud token', token)

    await changeRole(token)
    // join(roomState.appId,token,roomState.name,roomState.userUid)
}) // will be only for user ho return be an audience

socket.on('adminReJoinedRoomSuccess', async(user, room,token)=>{
    console.log('admin is back') //on for me
    console.log(user,room,token)
    user.isMuted = state.isMuted;
    room.admin.isAdmin = true;
    Me = {...user};
    state.isListener = true;
    roomState.audience = room.audience;
    roomState.brodcasters = [room.admin,...room.brodcasters];
    roomState.brodcasters.map(bro => bro.isMuted = true);
    roomState.admin = room.admin
    console.log(state)
    renderRoom(roomState, state)

    //agora
    agoraState.role = 'host';
    await join(room.APP_ID,token,room.name,user.uid)
    console.log("state.isMuted ===",state.isMuted)
    toggleMic(!state.isMuted)

    //record when rejoin
    let roomName = `${room.name}1`
    room.isRecording ? startRecording(roomName) : ''

})

socket.on('adminLeft', ()=>{
    console.log('admin has left if he does not come back after one min room will ended')
    snackbar(snackbarContainer,'info', `<b>Error: </b> admin has left if he does not come back after one min room will ended `, 5000);
    playAudio('/assets/audio/adminLeft.wav')
})

const redirectWhenRoomEnded = () => {
    
    window.location = '/archclub/home/index.html';
}

socket.on('roomEnded',()=>{
    leave()
    if(state.isAdmin) {
        redirectWhenRoomEnded()
    }else {
        snackbar(snackbarContainer,'info', `<b>info: </b> room ended `, 2500, redirectWhenRoomEnded);
    }
})

export const createRoom = function(obj){ 
    socket.emit('createRoom', obj);
}



function addItem(obj){
    roomState.audience.push(obj)
}

function addUserToSpeakers(user){
    roomState.brodcasters.push(user)
}

const playAudio = (src) =>{
    let audio = new Audio(src);
    audio.play();
    
}


export const changeMutestate = (obj) => {
    // let allSpeakers = [roomState.admin, ...roomState.brodcasters]
    roomState.brodcasters.map(user => {
        if(user.uid === obj.uid){
            user.isMuted = obj._audio_muted_;
            console.log('from toggle mic fun ==>',user.isMuted)
        }
    })
    // roomState.admin.uid === obj.uid ? roomState.admin.isMuted = obj._audio_muted_ : ''
    renderRoom(roomState, state)
    
}


export const changeVolumesIndicator = (arr) => {
    // let allSpeakers = [roomState.admin, ...roomState.brodcasters]
    arr.forEach(volume => {
        // console.log(volume.level)
        const user = roomState.brodcasters.find(user => user.uid === volume.uid)
        if(user && volume.level > 15){
            document.querySelector(`#volume-indicator-${user.uid}`).style.border = '3px solid #867ce9e6'
        }
        else if(user && volume.level < 15){
            document.querySelector(`#volume-indicator-${user.uid}`).style.border = '3px solid transparent'
        }
    })
    // roomState.admin.uid === obj.uid ? roomState.admin.isMuted = obj._audio_muted_ : ''
    // renderRoom(roomState, state)
    
}


const renderSpeakers = (speaker) => {
    // console.log(speaker);
    // let isMe = speaker._id === Me._id;
    // console.log(speaker.isMuted)
    // console.log(Me.isMuted)
    const markup = `
    <div class="user" data-_id="${speaker._id}">
        <div class="avatar" id="user-avatar-${speaker._id}">
            <img src=${speaker.photo} alt="Avatar" class="volume-indicator" id="volume-indicator-${speaker.uid}">
        </div>
        ${speaker.isMuted ? `<span class="mic">
            <img src="../../assets/room/microphone.svg" alt="">
        </span>` : ''}
        <div class="user-name ${ speaker.isAdmin ? '' : 'speaker'}">
            ${speaker.isAdmin ? `<img src="../../assets/room/star.svg" alt="">` : ''}
            <div>
                ${speaker.name}
            </div>
            ${speaker.isAdmin ? '' : `<div class="user-role">speaker</div>`}
        </div>

    </div>
    `
    roomSpeaker.insertAdjacentHTML('beforeend', markup)

    document.querySelector(`#user-avatar-${speaker._id}`).addEventListener('click', ()=>{
        modalContainer.classList.add('show-modal')
        insertuserModal(speaker, 'speaker')
    })
}


const renderlisteners = (audience) => {
    const markup = `
    <div class="user"  id="${audience._id}">
        <div class="avatar" id="user-avatar-${audience._id}">
            <img src=${audience.photo} alt="Avatar">
        </div>
        <span class="request-hand" id="request-hand-${audience._id}">
            ${audience.isAsked ? `
                <img class="request-hand-img" src="../../assets/room/hand.svg" alt="ask-to-speak">
                ` : ''
            }     
        </span>
        <div class="user-name listener">
            <div>
                ${audience.name}
            </div>
            <div class="user-role">listener</div>
        </div>
    </div>
    `
    roomListeners.insertAdjacentHTML('beforeend', markup)

    document.querySelector(`#user-avatar-${audience._id}`).addEventListener('click', ()=>{
        modalContainer.classList.add('show-modal')
        insertuserModal(audience, 'audience')
    })
}







const renderFooter = (state) => {
    const markup = `
    <div class="bt-options">
        ${state.isAdmin? `
            <button class="all-center" id="end-room">
                <span>✌️</span>
                <span class="text host-text">End Room</span>
            </button>`:
            `
            <button class="all-center" id="leave-room">
                <span>✌️</span>
                <span class="text">Leave quietly</span>
            </button>`
        }
        
        <div>
            ${state.isSpeaker && state.isMuted ? `<div class="plus all-center hand-over" id="handle-mute">
                <img src="../../assets/room/microphone.svg" alt="">
                </div>` : ''
            } 
            
            ${state.isSpeaker && !state.isMuted ? `<div class="plus all-center hand-over" id="handle-mute">
                <img src="../../assets/room/microphone-on.svg" alt="">
                </div>` : ''
            }
            
            ${state.isListener && !state.isAdmin ? `<div class="hand all-center hand-over" id="footer-hand">
                <img src="../../assets/room/hand.svg" alt="">
            </div>` : ''}
            ${!state.isAdmin && !state.isListener ? `<div class="hand all-center hand-over" id="goback">
            <img src="../../assets/room/down-arrow.svg" alt="">
        </div>` : ''}
        </div>
    </div>
    `
    footer.insertAdjacentHTML('beforeend', markup)
    // console.log(state.isSpeaker);
    if(state.isSpeaker){
        document.querySelector('#handle-mute').addEventListener('click',() => {
            toggleMic(state.isMuted)
            state.isMuted = !state.isMuted;
            Me.isMuted = state.isMuted;
            roomState.brodcasters.map(brod =>{
                brod._id === Me._id ? brod.isMuted = Me.isMuted : ''
            })
            
            renderRoom(roomState, state)
        })
    }
        
    
    

    if(document.querySelector('#footer-hand')) {
        document.querySelector('#footer-hand').addEventListener('click', ()=> {
            state.isAskedState = !state.isAskedState;
            socket.emit('askForPerms') 
            console.log('you asked for perms')
            if(state.isAskedState){
                snackbar(snackbarContainer,'info', `<b>info: </b> you asked to speak`, 2000);
            } else {
                snackbar(snackbarContainer,'info', `<b>info: </b> you take your hand down`, 2000);
            }
        })
    }

    if(document.querySelector('#goback')) {
        document.querySelector('#goback').addEventListener('click', ()=> {
            socket.emit('weHaveToGoBack')//user want to go back to audience
            console.log('user go back to aud')
        })
    }
    

    if(!state.isAdmin){
        if(document.querySelector('#leave-room')){
            document.querySelector('#leave-room').addEventListener('click',()=>{
                socket.disconnect();
            })
        }
        
    }
    else{
        console.log('is end room exist')
        if(document.querySelector('#end-room')) {
            document.querySelector('#end-room').addEventListener('click',async ()=>{
                if(roomState.isRecording) {
                    await recorder.stop();
                }
                //socket
                socket.emit('endRoom');
                console.log('emit end room')
            })
        }
    }
    
}



const renderRoom = (roomState, state) => {
    roomSpeaker.innerHTML = '';
    roomListeners.innerHTML = '';
    footer.innerHTML = '';

    //renderSpeakers(roomState.admin, true) //render admin
    roomState.brodcasters.map(user=> renderSpeakers(user)) //render users
    roomState.audience.map(user=> renderlisteners(user))
    
    renderFooter(state)
    
}


const insertuserModal = (user, type) => {
    // const adminUser = user._id === roomState.admin._id ? true : false; //for not showing controls when click on admin photo
    const markup = `
    <div class="user-modal">
        <div class="close-modal">
            <span id="close-modal-x">X</span>
        </div>
        <div class="user-info">
            <div class="user-img">
                <img src="${user.photo}" alt="Avatar">
            </div>
            <h3> 
                <a href="#">${user.name}</a>
            </h3>
        </div>
        ${state.isAdmin  ? `
            <div class="controls">
                <button id="cancel">cancel</button>
                ${type === 'audience' && user.isAsked ? `<button id="changeToSpk">change to speaker</button>` : ''}
                ${type === 'speaker' ? `<button id="changeToAud">change to audience</button>` : ''}
            </div>` : ''
        }
        
    </div>
    `
    modalContainer.insertAdjacentHTML('beforeend', markup)

    if(document.querySelector('#cancel')){
        document.querySelector('#cancel').addEventListener('click', ()=> {
            modalContainer.innerHTML = '';
            modalContainer.classList.remove('show-modal')
        })
    }

    if(document.querySelector('#changeToSpk')) {
        document.querySelector('#changeToSpk').addEventListener('click', ()=> {
            socket.emit('givePermsTo', {
                _id: user._id // user id 
            })
            modalContainer.innerHTML = '';
            modalContainer.classList.remove('show-modal')
        })
    }

    if(document.querySelector('#changeToAud')) {
        document.querySelector('#changeToAud').addEventListener('click', ()=> {
            socket.emit('takeAwayPermsFrom', {
                _id: user._id  // id for user who you want to change
            })
            modalContainer.innerHTML = '';
            modalContainer.classList.remove('show-modal')
        })
    }
    

    document.querySelector('#close-modal-x').addEventListener('click', ()=> {
        modalContainer.innerHTML = '';
        modalContainer.classList.remove('show-modal')
    })

    
}


const url = 'https://audiocomms-podcast-platform.herokuapp.com';
const fetchRoom = async function(id){

    try{

        const response = await fetch(`${url}/api/v1/rooms/${id}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            }
        });

        const res = await response.json();
        if(res.status !='fail'){
            const {data} = res;
            console.log(data.name);
            // return (data.name);

            if(data.name){
                socket.emit('joinRoom', data.name);
                document.querySelector('.loader-container').classList.add('show-modal')
            }

        } else{
            // console.log(res.message)
            snackbar(snackbarContainer,'error', `<b>Error: </b> there is no room with this id`, 5000, redirectWhenRoomEnded);
        }
        
        
    }
    catch(err){
        console.log(err);
        snackbar(snackbarContainer,'error', `<b>Error: </b>  ${err.message}`, 5000);
    }
}




 export const joinRoomFun = async(id) => {
    // if(document.querySelector('#create-join-container').classList.contains('show-modal')) {
    //     document.querySelector('#create-join-container').classList.remove('show-modal')
    // }
    document.querySelector('.create-room-container').classList.add('show-modal')
     await fetchRoom(id);
    //     console.log(roomName);
    // if(roomName){
    //     socket.emit('joinRoom', roomName);
    //     document.querySelector('.loader-container').classList.add('show-modal')
    // }
}


  
const queryParams = {}
const queryArr = window.location.search.slice(1).split('&')
    //const queryParams = {}
    queryArr.forEach(elem => {
      let [key, value] = elem.split('=')
      queryParams[key] = value
    })
const roomId = queryParams.id;

window.addEventListener('load', () => {
    sideBarView(roomSideBarHref,roomSideBar);

    if(roomId){

        joinRoomFun(roomId)
    } else {
        document.querySelector('.loader-container').classList.add('show-modal')
    }
})

