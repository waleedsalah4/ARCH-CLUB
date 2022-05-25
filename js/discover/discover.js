import { getAllPodcasts, discoverUsersReq, searchForUsers } from "../utilities/discoverReq.js";
import { likePodcast, disLikePodcast} from "../utilities/LikePodcats.js";
import { followUser, unFollowUser} from "../utilities/Follow.js";
import { sideBarView } from "../sideBar/sideBarView.js";
import { discoverSideBarHref } from "../sideBar/sideBarHref.js";
import { limiTitle } from "../podcast/podcastsView.js";

// const user_avatar = JSON.parse(localStorage.getItem('user-data'));
// const userImg = document.querySelector('#user-avatar')
const snackbarContainer = document.querySelector('#snackbar-container')

// const discoverSideBar = document.querySelector('#discover-sideBar')
const discoverSideBar = document.querySelector('.insertLinks')

const discoverUsersBtn = document.querySelector('#discover-users-btn')
const discoverPodsBtn = document.querySelector('#discover-pods-btn')
const podcastContentHolder = document.querySelector('.podcast-content-holder')
const podcastsContainer = document.querySelector('.podcasts-container')
const usersContainer = document.querySelector('.main-users-content')

const userListHolder = document.querySelector('.scroll') 
const usersList = document.querySelector('.users-list')
const searchProdcasterInput = document.querySelector('#search-prodcaster')
const searchProdcasterIcon = document.querySelector('#search-prodcaster-icon')
const searchUsersResultsList = document.querySelector('.search-users-result')
const tempText = document.querySelector('.temp-text')

//for pagination
let loadmoreUsers ;
let usersPage = 1;

let podcastPage = 1;
let loadMorePodcasts;

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
            podcastContentHolder.classList.add('hidden')
        }
    }
})

//show podcasts container
discoverPodsBtn.addEventListener('click', ()=> {
    if(!discoverPodsBtn.classList.contains('active')){
        discoverPodsBtn.classList.add('active')
        discoverUsersBtn.classList.remove('active')
        if(podcastContentHolder.classList.contains('hidden')){
            usersContainer.classList.add('hidden')
            podcastContentHolder.classList.remove('hidden')
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
            <p>
            <a href="../profile/index.html?id=${user._id}" target="_blank">${user.name}</a>
             <br> <span>${user.followers} Followers</span> </p>
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
            <div class="podcast-name">
                <a href="../podcasts/play-podcasts.html#${podcast._id}" target="_blank">
                    <h4 title="${podcast.name}">${limiTitle(podcast.name)}</h4>
                </a>
            </div>
            <p class="p-1 " title="go to ${podcast.createdBy.name} page">
                By <a href="../profile/index.html?id=${podcast.createdBy._id}" class="fw-bold" target="_blank">${podcast.createdBy.name}</a>
            </p>
            <div class="likes">
                <p id="podLikesNums-${podcast._id}">${podcast.likes}</p>
                <div class="likesIcon ${podcast.isLiked ? 'isLiked' : ''}" id="isLikedPod-${podcast._id}">
                    <i class="fa-solid fa-heart fa-2x"></i>
                </div>
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
                        <img src="../../assets/circle-play-solid.svg" alt="play">Play</button>
                </div> 
            </div>
        </div> 
    </div>
    
    `;

    podcastsContainer.insertAdjacentHTML('beforeend', markup)

    document.querySelector(`#isLikedPod-${podcast._id}`).addEventListener('click', ()=>{
        if(document.querySelector(`#isLikedPod-${podcast._id}`).classList.contains('isLiked')) {
            console.log('do unlike req')
            disLikePodcast(
                podcast._id,
                document.querySelector(`#isLikedPod-${podcast._id}`),
                document.querySelector(`#podLikesNums-${podcast._id}`),
                snackbarContainer
            )
        } else{
            console.log('do like req')
            likePodcast(
                podcast._id,
                document.querySelector(`#isLikedPod-${podcast._id}`),
                document.querySelector(`#podLikesNums-${podcast._id}`),
                snackbarContainer
            )
        }
    })


    playPodcastBtn = document.querySelector(`#play-podcast-btn-${podcast._id}`)
    playPodcastBtn.addEventListener('click', () => {
        if(podPlayerContainer){
            podPlayerContainer.parentElement.removeChild(podPlayerContainer)
        }
        insertPodPlayerElement(podcast.audio.url, podcast.name)
    })
}

const insertPodPlayerElement = (podsrc, name) => {
    
    const markup = `
        <div class="pod-palyer-container">
                <div class="pod-player">
                    <h6 class="pod-name">
                        ${name}
                    </h6>
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
            <p title="${user.name}">${limiTitle(user.name)} <br> <span>${user.followers} Followers</span> </p>
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
            followUser(user._id, document.querySelector(`#follow-btn-${user._id}`) , snackbarContainer)
        }
        else {
            unFollowUser(user._id, document.querySelector(`#follow-btn-${user._id}`) , snackbarContainer)
        }
    })
}

export const insertLoadMoreusersBtn = () => {
    const markup =`
        <div class="load-more-users">
            <button class="load-more-users-btn">Load More</button>
        </div>
    `
    userListHolder.insertAdjacentHTML('beforeend', markup)

    loadmoreUsers = document.querySelector('.load-more-users')
    loadmoreUsers.addEventListener('click', () => {
        usersPage++
        discoverUsersReq(usersList, usersPage)
        clearLoadMore(loadmoreUsers)

    })
}


export const insertLoadMorePodsBtn = () => {
    const markup =`
        <div class="load-more-pods">
            <button class="load-more-pods-btn">Load More</button>
        </div>
    `
    podcastContentHolder.insertAdjacentHTML('beforeend', markup)

    loadMorePodcasts = document.querySelector('.load-more-pods')
    loadMorePodcasts.addEventListener('click', () => {
        podcastPage++
        getAllPodcasts(podcastContentHolder, podcastPage)
        clearLoadMore(loadMorePodcasts)

    })
}


const clearLoadMore  = (element) => {
    if(element) {
        element.parentElement.removeChild(element)
    }
    //categorieLoadMore = null 
     element = null;
}

//---------------------------------------------------------------------------

//run when window loads
// const chechIfUserIsSign = () => {
//     const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'))
//     if(isLoggedIn === true) {
//         return
//     } else{
//         window.location = '/';
//     }
// }
// chechIfUserIsSign()







window.addEventListener('load', () =>{
    sideBarView(discoverSideBarHref, discoverSideBar)
    discoverUsersReq(usersList, usersPage)
    getAllPodcasts(podcastContentHolder, podcastPage)
});