import { sideBarView } from '../sideBar/sideBarView.js';
import { roomSideBarHref } from '../sideBar/sideBarHref.js';

const roomSideBar = document.querySelector('#room-sidebar')

const roomSpeaker = document.querySelector('.room-speakers')
const roomListeners = document.querySelector('.room-listeners')
const footer = document.querySelector('.footer-control')

var token = JSON.parse(localStorage.getItem('user-token'));

var socket = io('https://audiocomms-podcast-platform.herokuapp.com', {
    auth: {
        token,
        }
      });

socket.on('errorMessage', (msg) => {
        console.log(msg)
});

socket.on("connect", () => {
        console.log(socket.id); // x8WIv7-mJelg7on_ALbx
 });


socket.on('createRoomSuccess', (user,room,token) => {
        
    if(room){
        console.log(user,room,token)
        renderRoom(user,room,token);

    }
    else{
        document.querySelector('.create-room-container').classList.remove('show-modal')  
  }
})

export const createRoom = function(obj){
    
    socket.emit('createRoom', obj);
   
}

const fakeUserObject = {
    speakers: 12,
    listeners: 5,
    userRole: 'listener', // host | speaker
    admin: 
    {
        _id: '623256',
        name: 'alex',
        followers: '121.13',
        role: 'host'
    }
    ,
    speakerUsers: [
       
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
    ],
    listenerUsers: [
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
    ]

}

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


const renderlisteners = (listener) => {
    const markup = `
    <div class="user"  data-_id="${listener._id}>
        <div class="avatar">
            <img src="https://picsum.photos/seed/picsum/200/300" alt="Avatar">
        </div>
        <span class="mic">
            <img src="../../assets/room/microphone.svg" alt="">
        </span>
        <div class="user-name listener">
            <div>
                ${listener.name}
            </div>
            <div class="user-role">listener</div>
        </div>
    </div>
    `
    roomListeners.insertAdjacentHTML('beforeend', markup)
}




const renderFooter = (role) => {
    const markup = `
    <div class="bt-options">
        <button class="all-center">
            <span>✌️</span>
            ${role === "host" ? `<span class="text host-text">End Room</span> `: `<span class="text">Leave quietly</span>`}
        </button>
        <div>
            <div class="plus all-center hand-over" id="handle-mute">
                <img src="../../assets/room/microphone.svg" alt="">
            </div>
        ${role === "listener" ? `<div class="hand all-center hand-over">
            <img src="../../assets/room//hand.svg" alt="">
        </div>` : ''}
        </div>
    </div>
    `
    footer.insertAdjacentHTML('beforeend', markup)
}



const renderRoom = (user,room,token) => {
    renderSpeakers(user, true) //render admin
    fakeUserObject.speakerUsers.map(user=> renderSpeakers(user, false)) //render users
    fakeUserObject.listenerUsers.map(user=> renderlisteners(user))
    renderFooter(fakeUserObject.userRole)
}

//renderRoom(fakeUserObject)


window.addEventListener('load', () => {
    sideBarView(roomSideBarHref,roomSideBar)
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