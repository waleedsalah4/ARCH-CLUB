import { getAllPodcasts, discoverUsersReq, searchForUsers } from "../utilities/discoverReq.js";
import { followUser, unFollowUser} from "../utilities/Follow.js";

const discoverUsersBtn = document.querySelector('#discover-users-btn')
const discoverPodsBtn = document.querySelector('#discover-pods-btn')
const podcastsContainer = document.querySelector('.podcasts-container')
const usersContainer = document.querySelector('.main-users-content')
const usersList = document.querySelector('.users-list')
const searchProdcasterInput = document.querySelector('#search-prodcaster')
const searchProdcasterIcon = document.querySelector('#search-prodcaster-icon')
const searchUsersResultsList = document.querySelector('.search-users-result')
const tempText = document.querySelector('.temp-text')

let playerContentHolder = document.querySelector('.player-content')
let podPlayerContainer;

let playPodcastBtn;
// let followBtn;

//show users container
discoverUsersBtn.addEventListener('click', ()=> {
    if(!discoverUsersBtn.classList.contains('active')){
        discoverUsersBtn.classList.add('active')
        discoverPodsBtn.classList.remove('active')
        if(usersContainer.classList.contains('hidden')){
            usersContainer.classList.remove('hidden')
            podcastsContainer.classList.add('hidden')
        }
    }
})

//show podcasts container
discoverPodsBtn.addEventListener('click', ()=> {
    if(!discoverPodsBtn.classList.contains('active')){
        discoverPodsBtn.classList.add('active')
        discoverUsersBtn.classList.remove('active')
        if(podcastsContainer.classList.contains('hidden')){
            usersContainer.classList.add('hidden')
            podcastsContainer.classList.remove('hidden')
        }
    }
})

searchProdcasterInput.addEventListener('keyup', (e) => {
    if (e.keyCode == 13){
        if(searchProdcasterInput.value) {
            searchUsersResultsList.innerHTML = ''
            searchForUsers(searchUsersResultsList,searchProdcasterInput.value)
        } 
    }
})

searchProdcasterIcon.addEventListener('click', () => {
    if(searchProdcasterInput.value) {
        clearElement(tempText)
        searchUsersResultsList.innerHTML = ''
        searchForUsers(searchUsersResultsList,searchProdcasterInput.value)
    } 
})

const clearElement = (element) => {
    if (element) element.parentElement.removeChild(element);
};

export const renderSearchUserResult=(user)=> {
    const markup = `
    <li class="d-flex justify-content-between">
        <div class="d-flex"> 
            <img src="${user.photo}" alt="">
            <p >${user.name} <br> <span>${user.followers} Followers</span> </p>
        </div>
    </li>
    `
    searchUsersResultsList.insertAdjacentHTML('beforeend', markup)
}


//---------------------------------------------
//podcasts

export const discoverPodcasts = (podcast) => {
    const markup = `  
    <div class="podcast-component">
        <div class="pic" title="open podcats in podcasts player">
            <a href="../podcasts/play-podcasts.html#${podcast._id}" target="_blank">
                <img src="${podcast.createdBy.photo}" alt="user podcast">
            </a>
        </div>
        <div class="description p-2">
            <div class="podcast-name text-light fw-bold  fs-5">${podcast.name}</div>
            <p class="p-1 " title="go to ${podcast.createdBy.name} page">By <span class="fw-bold">${podcast.createdBy.name}</span></p>
            <div class="likes">
                <p>${podcast.likes}</p>
                <i class="fa-solid fa-heart fa-2x"></i>
            </div>
            <hr>
            
            <div class="inner-infos">

                <div class="d-flex justify-content-between"> 
                    <div class="d-flex">
                        <img src="../../assets/squareIcon.svg" alt="icon">
                        <p class="category">${podcast.category}</p>
                    </div>
                    <a href="${podcast.audio.url}" download="${podcast.name}">
                        <img src="../../assets/cloud-download.svg" alt="download">
                    </a>
                </div>

                <div class="d-flex justify-content-between"> 
                    <div class="d-flex">
                        <img src="../../assets/clock.svg" alt="">
                        <p class="duration">${Math.floor(podcast.audio.duration / 60)} : ${ Math.floor(podcast.audio.duration - Math.floor(podcast.audio.duration / 60) * 60)}</p>
                    </div>
                    <button title="play podcast in this page" class="play-podcast-btn" id="play-podcast-btn-${podcast._id}">
                        <img src="../../assets/circle-play-solid.svg" alt="play" >
                        Play</button>
                </div> 
            </div>
        </div> 
    </div>
    
    `;

    podcastsContainer.insertAdjacentHTML('beforeend', markup)
    playPodcastBtn = document.querySelector(`#play-podcast-btn-${podcast._id}`)
    playPodcastBtn.addEventListener('click', () => {
        if(podPlayerContainer){
            podPlayerContainer.parentElement.removeChild(podPlayerContainer)
        }
        insertPodPlayerElement(podcast.audio.url)
    })
}

const insertPodPlayerElement = (podsrc) => {
    
    const markup = `
        <div class="pod-palyer-container">
                <div class="pod-player">
                    <audio src="${podsrc}" autoplay controls></audio>
                </div>
                <div id="remove-player-container">
                    <i class="fa-solid fa-x"></i>
                </div>
        </div>
    `;
    playerContentHolder.insertAdjacentHTML('beforeend', markup)
    podPlayerContainer = document.querySelector('.pod-palyer-container')
    document.querySelector('#remove-player-container').addEventListener('click', ()=> {
        podPlayerContainer.parentElement.removeChild(podPlayerContainer)
        podPlayerContainer = null
    })
}

//--------------------------------------------------------------------------
// discover users
export const discoverUsersDisplay = (user) => {
    const markup = `
    <li class="d-flex justify-content-between">
        <div class="d-flex"> 
            <img src="${user.photo}" alt="">
            <p >${user.name} <br> <span>${user.followers} Followers</span> </p>
        </div>
        <div> 
         <button class="cBtn follow-btn" id="follow-btn-${user._id}">Follow</button>
        </div>
    </li>
    `
    usersList.insertAdjacentHTML('beforeend', markup)
    // followBtn = document.querySelector(`#follow-btn-${user._id}`)
    document.querySelector(`#follow-btn-${user._id}`).addEventListener('click', () =>{
        if(document.querySelector(`#follow-btn-${user._id}`).textContent === 'Follow') {
            console.log(document.querySelector(`#follow-btn-${user._id}`))
            followUser(user._id, document.querySelector(`#follow-btn-${user._id}`) )
        }
        else {
            unFollowUser(user._id, document.querySelector(`#follow-btn-${user._id}`) )
        }
    })
}

//---------------------------------------------------------------------------
// search users

window.addEventListener('load', () =>{
    discoverUsersReq(usersList)
    getAllPodcasts(podcastsContainer)
});