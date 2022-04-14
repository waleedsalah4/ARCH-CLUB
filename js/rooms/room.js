import { sideBarView } from '../sideBar/sideBarView.js';
import { roomSideBarHref } from '../sideBar/sideBarHref.js';

const roomSideBar = document.querySelector('#room-sidebar')

const roomSpeaker = document.querySelector('.room-speakers')
const roomListeners = document.querySelector('.room-listeners')
const footer = document.querySelector('.footer-control')


var token = JSON.parse(localStorage.getItem('user-token'));

let state = {
    isAdmin: false,
    isSpeaker:false,
    isListener:false
};

let roomState = {
        admin : {},
        audience : [],
        brodcasters : []
};

var socket = io('https://audiocomms-podcast-platform.herokuapp.com', {
    auth: {
        token,
        }
      });

window.socket = socket;

socket.on('errorMessage', (msg) => {
        console.log(msg)
});

socket.on("connect", () => {
        console.log(socket.id); // x8WIv7-mJelg7on_ALbx
 });


socket.on('createRoomSuccess', (user,room,token) => {
        
    if(room){
        console.log(user,room,token)
        roomState.admin = user;
        roomState.audience = room.audience;
        roomState.brodcasters = room.brodcasters;
        state.isAdmin = true;
        renderRoom(roomState);

    }
    else{
        document.querySelector('.create-room-container').classList.remove('show-modal')  
  }
})

socket.on('joinRoomSuccess', (user, room, token) => {
    console.log('join room',user,room,token)
    state.isListener = true;
    roomState.audience = room.audience;
    roomState.admin = room.admin
    renderRoom(roomState)
})

socket.on('userJoined', (user) => {
    console.log('userJoined', user)
    console.log(roomState);
    addItem(user);
    renderRoom(roomState);
})

socket.on('userLeft', (user) => {
    console.log('user left', user)
    //removeUserFromRoom(user._id);
    if(roomState.audience.find())
    removeItem(user._id,roomState.audience);
    renderRoom(roomState)

    
    //window.location = '/archclub/home/index.html';

})

export const createRoom = function(obj){
    
    socket.emit('createRoom', obj);

   
}


function removeItem(id, items){
    items.splice(items.findIndex((i)=>{
    return i.id === id;
    }), 1);
}

function addItem(obj){
    roomState.audience.push(obj)
}


/* const removeUserFromRoom = function(id){
    const userId = document.querySelector(`#${id}`)
    console.log(userId);
} */

const renderSpeakers = (speaker, admin) => {
    const markup = `
    <div class="user" data-_id="${speaker._id}">
        <div class="avatar">
            <img src=${speaker.photo} alt="Avatar">
        </div>
        <span class="mic">
            <img src="../../assets/room/microphone-on.svg" alt="">
        </span>
        <div class="user-name ${ admin ? '' : 'speaker'}">
            ${admin ? `<img src="../../assets/room/star.svg" alt="">` : ''}
            <div>
                ${speaker.name}
            </div>
            ${admin ? '' : `<div class="user-role">speaker</div>`}
        </div>
    </div>
    `
    roomSpeaker.insertAdjacentHTML('beforeend', markup)
}


const renderlisteners = (audience) => {
    const markup = `
    <div class="user"  id="${audience._id}">
        <div class="avatar">
            <img src=${audience.photo} alt="Avatar">
        </div>
        <span class="mic">
            <img src="../../assets/room/microphone.svg" alt="">
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
}


socket.on('roomEnded',()=>{
    console.log('room ended')
    window.location = '/archclub/home/index.html';
  })

const EndRoom = function(){
    document.querySelector('#end-room').addEventListener('click',()=>{
        socket.emit('endRoom');
    })

}



const renderFooter = () => {
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
            <div class="plus all-center hand-over" id="handle-mute">
                <img src="../../assets/room/microphone.svg" alt="">
            </div>
        ${state.isListener ? `<div class="hand all-center hand-over">
            <img src="../../assets/room//hand.svg" alt="">
        </div>` : ''}
        </div>
    </div>
    `
    footer.insertAdjacentHTML('beforeend', markup)
    
    if(state.isListener){
        document.querySelector('#leave-room').addEventListener('click',()=>{

            socket.disconnect();
        })
    }
    else{
        EndRoom();
    }
    
}



const renderRoom = (roomState) => {
    roomSpeaker.innerHTML = '';
    roomListeners.innerHTML = '';
    footer.innerHTML = '';
    renderSpeakers(roomState.admin, true) //render admin
    roomState.brodcasters.map(user=> renderSpeakers(user, false)) //render users
    roomState.audience.map(user=> renderlisteners(user))
    
    renderFooter()
    
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
            return (data.name);
        } 
        
        
    }
    catch(err){
        console.log(err);
    }
}
//renderRoom(fakeUserObject)

  
const queryParams = {}
const queryArr = window.location.search.slice(1).split('&')
    //const queryParams = {}
    queryArr.forEach(elem => {
      let [key, value] = elem.split('=')
      queryParams[key] = value
    })
const roomId = queryParams.id;

window.addEventListener('load', async () => {
    sideBarView(roomSideBarHref,roomSideBar);

    if(roomId){

        document.querySelector('.create-room-container').classList.add('show-modal')
        const roomName = await fetchRoom(roomId);
        console.log(roomName);
        if(roomName){
            socket.emit('joinRoom', roomName);
        }
    }
})

/*
// const sidebar = document.querySelector('.nav')
// const toggle = document.querySelector("#toggle");


/*room details 
const speakerListener = document.querySelector('.speak-listen');
const currentSpeakersInRoom = document.querySelector('.current-talkers')
const talkersCount = document.querySelector('.talkers-count')
const audincesCount = document.querySelector('.audinces-count')
// const showUserAndControls = document.querySelector('.all-displayRoom')
const displayTitle = document.querySelector('.display-title')
const titleForUsersInAllDisplayRoom = document.querySelector('.display-title p')
const usersInAllDisplay = document.querySelector('.display-users')
const getControls = document.querySelector('.display-controls')

const speakerBtn = document.querySelector('#getSpeakers')
const audincesBtn = document.querySelector('#getAudinces') 
const controlBtn = document.querySelector('#control-button')


const fakeUserObject = {
    speakers: 12,
    listeners: 5,
    userRole: 'listner', // host | speaker
    speakerUsers: [
        {
            _id: '623256',
            name: 'alex',
            followers: '121.13',
            role: 'host'
        },
        {
            _id: '626256',
            name: 'tony',
            followers: '124.13',
            role: 'speaker'
        },
        {
            _id: '621356',
            name: 'ahmed',
            followers: '591.13',
            role: 'speaker'
        },
        {
            _id: '681256',
            name: 'lee',
            followers: '391.13',
            role: 'speaker'
        },
        {
            _id: '6281256',
            name: 'max',
            followers: '191.13',
            role: 'speaker'
        },
        {
            _id: '620256',
            name: 'mark',
            followers: '131.103',
            role: 'speaker'
        },
    ],
    listenerUsers: [
        {
            _id: '623256',
            name: 'alx',
            followers: '121.13',
            role: 'listner'
        },
        {
            _id: '626256',
            name: 'pop',
            followers: '124.13',
            role: 'listner'
        },
        {
            _id: '621356',
            name: 'mo',
            followers: '591.13',
            role: 'listner'
        },
        {
            _id: '681256',
            name: 'lee',
            followers: '391.13',
            role: 'listner'
        },
        {
            _id: '6281256',
            name: 'moo',
            followers: '191.13',
            role: 'listner'
        },
        {
            _id: '620256',
            name: 'marki',
            followers: '131.103',
            role: 'listner'
        },
        {
            _id: '629256',
            name: 'alee',
            followers: '191.153',
            role: 'listner'
        },
    ]

}

// ----display controls

const displayControls = (role) =>{
    let markup;
    if(role === 'host'){
       markup = `
        <div>
            <button class="control-btn">End Room</button>
        </div>
        <div>
            <button class="control-btn mic"> 
                <span class="control-mic">
                    <i class='bx bx-microphone'></i>
                </span>
                Mic off
            </button>
        </div>
        `
    } else if(role === 'speaker'){
        markup = `
            <div>
                <button class="control-btn">Leave Room</button>
            </div>
            <div>
                <button class="control-btn mic"> 
                    <span class="control-mic">
                        <i class='bx bx-microphone-off'></i>
                    </span>
                    Mic on
                </button>
            </div>
        `
    } else {
        markup = `
            <div>
                <button class="control-btn">Leave Room</button>
            </div>
            <div>
                <button class="control-btn">Ask To Talk</button>
            </div>
            <div>
                <button class="control-btn mic"> 
                    <span class="control-mic">
                        <i class='bx bx-microphone-off'></i>
                    </span>
                    Mic on
                </button>
            </div>
        `
    }
    if(!displayTitle.classList.contains('hide') || !usersInAllDisplay.classList.contains('hide')){
        displayTitle.classList.add('hide');
    }
    getControls.textContent = '';
    usersInAllDisplay.textContent = ''
    getControls.insertAdjacentHTML('beforeend', markup)
    getControls.classList.remove('hide')
     
}

// ------------------show all----------------------------------

const setTitleForUsersInDisplayAll = (title) => {
   
    if(displayTitle.classList.contains('hide')){
        displayTitle.classList.remove('hide')
    }
    titleForUsersInAllDisplayRoom.textContent= title;
}

//listeners
const getAllListeners = (listener, role) => {
    let markup =`
    <div class="users-list" id=${listener._id}>
        <div class="user-img">
            <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80" alt="user-img">
        </div>
        <div>
            <h3 class="user-name">${listener.name}</h3>
            <p class="user-followers">${listener.followers} Followers</p>
        </div>
        ${role === 'host' ? `<div>
            <button class="control-btn">Make Speaker</button>
        </div>` : ''}
        
    </div>
    `
    // if(usersInAllDisplay.classList.contains('hide')){
    //     usersInAllDisplay.remove('hide')
    // }
    usersInAllDisplay.insertAdjacentHTML('beforeend', markup)
}


//speakers
const getAllSpeakers = (speaker, role)=>{
    let markup =`
    <div class="users-list" id=${speaker._id}>
        <div class="user-img">
            <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80" alt="user-img">
        </div>
        <div>
            <h3 class="user-name">${speaker.name}</h3>
            <p class="user-followers">${speaker.followers} Followers</p>
        </div>
        ${role === 'host' ? `<div>
            <button class="control-btn">Make Audience</button>
        </div>` : ''}
        
    </div>
    `
    
    usersInAllDisplay.insertAdjacentHTML('beforeend', markup)
}

const displayAllSpeakers = (role)=> {
    usersInAllDisplay.textContent = '';
    if(!getControls.classList.contains('hide')){
        getControls.classList.add('hide')
    }
    // if(usersInAllDisplay.classList.contains('hide')){
    //     usersInAllDisplay.remove('hide')
    // }
    fakeUserObject.speakerUsers.map(speaker=> getAllSpeakers(speaker, role))
}
const displayAllListeners = (role)=> {
    usersInAllDisplay.textContent = '';
    if(!getControls.classList.contains('hide')){
        getControls.classList.add('hide')
    }
    // if(usersInAllDisplay.classList.contains('hide')){
    //     usersInAllDisplay.remove('hide')
    // }
    console.log(usersInAllDisplay)
    fakeUserObject.listenerUsers.map(listener=> getAllListeners(listener, role))
}


// ------------------ end show all----------------------------------


const setSpeakersAndListenersCount = (listeners, speakers) => {
    audincesCount.textContent = listeners;
    talkersCount.textContent = speakers;
}

//speakers in room
const displayCurrentSpeakers = (speaker) => {
    let mark = `
        <div class="talkers-card">
            <div class="user-img">
                <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80" alt="user">
                ${speaker.role === 'host' ? `<i class='bx bxs-star host' style='color:#c5be2a'></i>` : ''}
                <i class='bx bxs-microphone user-mic'></i>
            </div>
            <div>
                <span>|'|'|'|' |'|'|'|' |'|'|'|'</span>
            </div>
        </div>
    
    `;
    currentSpeakersInRoom.insertAdjacentHTML('beforeend', mark)
}

//speakers in room
const getCurrentSpeakers = () => {
   fakeUserObject.speakerUsers.map(speaker=> displayCurrentSpeakers(speaker)) 
}

setSpeakersAndListenersCount(fakeUserObject.listeners, fakeUserObject.speakers)
getCurrentSpeakers()

displayControls(fakeUserObject.userRole)

//events
// toggle.addEventListener("click" , () =>{
//     sidebar.classList.toggle("close");
// })


//room events

speakerBtn.addEventListener('click', ()=>{
    setTitleForUsersInDisplayAll('Speakers')
    displayAllSpeakers(fakeUserObject.userRole)
})
audincesBtn.addEventListener('click', ()=> {
    setTitleForUsersInDisplayAll('Listeners')
    displayAllListeners(fakeUserObject.userRole)
})

controlBtn.addEventListener('click', ()=>{
    displayControls(fakeUserObject.userRole)
})


*/