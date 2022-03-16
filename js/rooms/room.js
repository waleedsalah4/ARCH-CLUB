
const sidebar = document.querySelector('.nav')
const toggle = document.querySelector("#toggle");

/*room details */
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
toggle.addEventListener("click" , () =>{
    sidebar.classList.toggle("close");
})


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