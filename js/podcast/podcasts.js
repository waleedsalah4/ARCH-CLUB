import { loadSpinner, clearLoader } from '../loader.js';
import { limiTitle } from './podcastsView.js';
import {getCategories}from '../utilities/getCategory.js';
import { getAllMyFollowingPodcasts, getMyFollowingPodcastsByCategoryName } from '../utilities/requests.js';
import { likePodcast, disLikePodcast } from '../utilities/LikePodcats.js'
// import {podcastFeedback} from '../podcast/feedBack.js';
// import {requesting, podPage} from '../utilities/requests.js';
import { podcastsSideBarHref } from '../sideBar/sideBarHref.js';
import { sideBarView } from '../sideBar/sideBarView.js';

const podcastsSideBar = document.querySelector('#podcasts-sidebar')
const snakeBarContainer = document.querySelector('#snackbar-container')

const userImg = document.querySelector('#user-avatar');
const user_avatar = JSON.parse(localStorage.getItem('user-data'));

let podPage = 1;
let categoryItemsPage = 1;
let likeIcon;

let playerContentHolder = document.querySelector('.player-content')
let podPlayerContainer;
let loadmore;
let categorieLoadMore;

//conatiner that hold categores and podcasts
//get to add load more btn at the end of it
const mainContentcontainer = document.querySelector('#main-content-container')
const podcastContainer = document.querySelector('.podcasts-veiw-container')


let playPodcastBtn;

const categoriesContainer = document.querySelector('.categories-container')
let categoreisItems = [];




//-------------------------------------
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
//-------------------------------------

//---------------podcasts category----------------------

const addAllCatgorydiv = () => {
    const markup = `
    <div class="categorie-component active">All</div>
    `
    categoriesContainer.insertAdjacentHTML('beforeend', markup)
}

const displayCategory = (data) => {

    const markup = `
    <div class="categorie-component" id="${data._id}">${data.name}</div>
    `
    categoriesContainer.insertAdjacentHTML('beforeend', markup)
}

const createCategory = async() => {
    loadSpinner(categoriesContainer);

    const cat = await getCategories();
    
    clearLoader();
    addAllCatgorydiv();
    cat.map(c=> displayCategory(c))

    categoreisItems= Array.from(document.querySelectorAll('.categorie-component'))

// button actions
    for(let i=0; i<categoreisItems.length; i++){
        categoreisItems[i].onclick = function(){
            removeAllCtegorActive();
            categoreisItems[i].classList.add('active')

            //get podcasts by category name
            podcastContainer.innerHTML = '';
            loadSpinner(podcastContainer);
            if(categoreisItems[i].textContent === 'All'){

                //clear load more
                if(document.querySelector('.load-more')){
                    clearLoadMore(document.querySelector('.load-more'))
                }
                //clear feed back
                if(document.querySelector('.feed-back')){
                    document.querySelector('.feed-back').parentElement.removeChild(document.querySelector('.feed-back'))
                }

                //clearLoadMore(categorieLoadMore)
                if(document.querySelector('.load-more-category')){
                    categorieLoadMore.parentElement.removeChild(categorieLoadMore)
                    categorieLoadMore = null
                }

                podPage = 1
                getAllMyFollowingPodcasts(podcastContainer,podPage,mainContentcontainer)

            } else {
                //clear feed back
                if(document.querySelector('.feed-back')){
                    document.querySelector('.feed-back').parentElement.removeChild(document.querySelector('.feed-back'))
                }

                //clear load more
                if(document.querySelector('.load-more')){
                    clearLoadMore(document.querySelector('.load-more'))
                }
                // clearLoadMore(loadmore)
                if(document.querySelector('.load-more-category')){
                    categorieLoadMore.parentElement.removeChild(categorieLoadMore)
                    categorieLoadMore = null
                }
                categoryItemsPage = 1
                console.log(categoreisItems[i].textContent, categoryItemsPage)
                getMyFollowingPodcastsByCategoryName(podcastContainer,categoreisItems[i].textContent,categoryItemsPage,mainContentcontainer);
                // insertLoadMoreBtnForCategories(categoreisItems[i].textContent)
               
                
            }
            clearLoader()
            // console.log(categoreisItems[i].textContent)
        }
    }
}
createCategory();



function removeAllCtegorActive() {
    categoreisItems.forEach(item =>
        item.classList.remove('active')
    );
}


//******************************************************************* */
//---------------podcasts----------------------

export const displayPodcasts = (podcast) => {
    const markup = `  
    <div class="podcast-component">
        <div class="pic" title="open podcats in podcasts player">
            <a href="./play-podcasts.html#${podcast._id}" target="_blank">
                <img src="${podcast.createdBy.photo}" alt="user podcast">
            </a>
        </div>
        <div class="description p-2">
            <div class="podcast-name">
                <a href="./play-podcasts.html#${podcast._id}" target="_blank">
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
                        <img src="../../assets/circle-play-solid.svg" alt="play" >
                        Play</button>
                </div> 
            </div>
        </div> 
    </div>
    
    `;

    podcastContainer.insertAdjacentHTML('beforeend', markup)
  
    document.querySelector(`#isLikedPod-${podcast._id}`).addEventListener('click', ()=>{
            if(document.querySelector(`#isLikedPod-${podcast._id}`).classList.contains('isLiked')) {
                console.log('do unlike req')
                disLikePodcast(
                    podcast._id,
                    document.querySelector(`#isLikedPod-${podcast._id}`),
                    document.querySelector(`#podLikesNums-${podcast._id}`),
                    snakeBarContainer
                )
            } else{
                console.log('do like req')
                likePodcast(
                    podcast._id,
                    document.querySelector(`#isLikedPod-${podcast._id}`),
                    document.querySelector(`#podLikesNums-${podcast._id}`),
                    snakeBarContainer
                )
            }
        })


    playPodcastBtn = document.querySelector(`#play-podcast-btn-${podcast._id}`)
    playPodcastBtn.addEventListener('click', () => {
        if(podPlayerContainer){
            podPlayerContainer.parentElement.removeChild(podPlayerContainer)
        }
        insertPodPlayerElement(podcast.audio.url, podcast.name)
        // console.log(e.target, playPodcastBtn)
    })
}

export const insertLoadMoreBtn = () => {
    const markup =`
        <div class="load-more">
            <button class="load-more-btn">Load More</button>
        </div>
    `
    mainContentcontainer.insertAdjacentHTML('beforeend', markup)

    loadmore = document.querySelector('.load-more')
    loadmore.addEventListener('click', () => {
        podPage++
        getAllMyFollowingPodcasts(podcastContainer, podPage,mainContentcontainer)
        clearLoadMore(loadmore)

    })
}

export const insertLoadMoreBtnForCategories = (value) => {
    console.log(value)
    const markup =`
        <div class="load-more-category">
            <button class="load-more-btn">Load More</button>
        </div>
    `
    mainContentcontainer.insertAdjacentHTML('beforeend', markup)

    categorieLoadMore = document.querySelector('.load-more-category')
    categorieLoadMore.addEventListener('click', () => {
        categorieLoadMore.parentElement.removeChild(categorieLoadMore)
        categorieLoadMore = null
        categoryItemsPage++
        console.log(categoryItemsPage)
        getMyFollowingPodcastsByCategoryName(podcastContainer,value, categoryItemsPage,mainContentcontainer)
        
    })
}


const clearLoadMore  = (element) => {
    if(element) {
        element.parentElement.removeChild(element)
    }
    //categorieLoadMore = null 
    loadmore = null;
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






//get user image
const insertUserImg = () => {
    
    if(user_avatar){
        const markup = `
            <img  src="${user_avatar.photo}" alt="user profile picture" class="circle-profile-img">
        `
        userImg.insertAdjacentHTML('beforeend', markup)
    }
    else{
        return;
    }
}

window.addEventListener('load', () =>{
    sideBarView(podcastsSideBarHref, podcastsSideBar)
    insertUserImg()
    //mainContentcontainer => for feedback
    getAllMyFollowingPodcasts(podcastContainer, podPage, mainContentcontainer)
 });

// let newScrolltop = 0

// window.addEventListener('scroll', () => {
// 	const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
//     // console.log(scrollHeight,scrollTop,clientHeight)
// 	if(requesting){
//         if(clientHeight + scrollTop > scrollHeight - 5 && scrollTop > newScrolltop) {
//             console.log(requesting)
//             newScrolltop = scrollTop
//             console.log(newScrolltop)
//             setTimeout(getPage, 1500)
    
//         }

//     }
// });

// const getPage =() => {
//     getAllMyFollowingPodcasts(podcastContainer,podPage)
// }