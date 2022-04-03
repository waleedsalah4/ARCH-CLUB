
import { getMe, url  ,uploadPodcast,fetchFollowing , fetchFollowers, deletePodcast,getOtherUser,getMyEvents,getEventById} from '../utilities/profileReq.js';
import { loadSpinner, clearLoader} from '../loader.js';
import { popupMessage ,getDate} from '../utilities/helpers.js';

import { sideBarView } from '../sideBar/sideBarView.js';
import { profileSideBarHref } from '../sideBar/sideBarHref.js';

//elements
const bar = document.querySelector('.sideBar');
const barIcons = document.querySelectorAll('.bar-icons');
const barIcon = document.querySelector('.bar-icon');
const infoContent = document.querySelectorAll('.info span');
//const btnFollowProfile = document.querySelector('.follow-following');
const profileVeiw = document.querySelector('.profile-veiw');
const podcastContent = document.querySelector('.podcast-content');
const podcastComponentHeading = document.querySelector('.podcast-component-heading');
const hideDisplaySide = ['podcast-content','followers-content' ,'following-content'];
const barLinks = document.querySelectorAll('.sideBar ul .bar-item');
const generalBtn = document.querySelectorAll('.cBtn');
const addPodcast = document.querySelector('.add-podcast-btn');
const podcastContainerProfile = document.getElementById('podcast-container');
const followingContainer = document.getElementById('following-container');
const followersContainer = document.getElementById('followers-container');
const podcastPopup = document.querySelector('.popup-overlay-podcast');
const file = document.getElementById('podcast-file');
///////////////////////////////////////////////////////////////////////////////////////////////////
//side bar element
const profileSideBar = document.querySelector('#profile-sidebar');

//for podcasts player
let playerContentHolder = document.querySelector('.profile-player-content')
let podPlayerContainer;
let playPodcastBtn;



//2)active link (podcast , followers , following) and show its content

const hideDisplaySideInfo =  function(e){
    
    if(e.target.matches('span') ){
        //remove events display
        if(!document.querySelector('.event-content').classList.contains('hidden')){
            document.querySelector('.event-content').classList.add('hidden');
        }

        //1) mark target as active
        document.querySelectorAll('.info span').forEach(el=> el.classList.remove('active'));
        e.target.classList.add('active');


        //2) show side content
           // hideDisplaySide.forEach(el=> el.classList.add('hidden'))
            hideDisplaySide.forEach(el=> {
                document.querySelector(`.${el}`).classList.add('hidden');
            })
            //1) if podcasts
            if(e.target.classList.contains('podcasts')) {
                //change heading

                podcastComponentHeading.innerHTML = `
                ${JSON.parse(localStorage.getItem('user-data')).name}'s Podcasts
                <button class="add-podcast-btn">
                        <i class="fa-solid fa-circle-plus fs-3 me-4"></i>
                        Add podcast
                    </button>
                    `;

                document.querySelector(`.${hideDisplaySide[0]}`).classList.remove('hidden');
            }

            //2) if followers
            if(e.target.classList.contains('followers')) {
                //change heading
                podcastComponentHeading.textContent = `${JSON.parse(localStorage.getItem('user-data')).name}'s Followers`;
                document.querySelector(`.${hideDisplaySide[1]}`).classList.remove('hidden');
            }

            //3)if following
            if(e.target.classList.contains('following')) {
                //change heading
                podcastComponentHeading.textContent = `${JSON.parse(localStorage.getItem('user-data')).name}'s Following`;
                document.querySelector(`.${hideDisplaySide[2]}`).classList.remove('hidden');
            }
            

    }
}

//if events
const displayEvents = function(){
    document.querySelectorAll('.info span').forEach(el=> el.classList.remove('active'));
    hideDisplaySide.forEach((el)=> {if(!document.querySelector(`.${el}`).classList.contains('hidden')) document.querySelector(`.${el}`).classList.add('hidden') });
    document.querySelector('.event-content').classList.remove('hidden');

}


//3)changing the follow btn into following
/* btnFollowProfile.addEventListener('click',function(){

    if(btnFollowProfile.classList.contains('btn-follow-profile')){ 

        //1)change btn ui
        btnFollowProfile.classList.remove('btn-follow-profile');
        btnFollowProfile.classList.add('btn-following-profile');
        btnFollowProfile.textContent = 'Following';

        //2)add user as following

    }

    else{

        //1) change btn ui
        btnFollowProfile.classList.remove('btn-following-profile');
        btnFollowProfile.classList.add('btn-follow-profile');
        btnFollowProfile.textContent = 'Follow';
       

        //2) remove user from following 

    }

}); */


//4) follow-following general
generalBtn.forEach(btn=> {
    btn.addEventListener('click',()=>{
        if(btn.classList.contains('follow-btn')){
            btn.textContent = "Following";
            btn.classList.remove('follow-btn');
            btn.classList.add('following-btn');
        }
    
        else{
            btn.textContent = "Follow";
            btn.classList.remove('following-btn');
            btn.classList.add('follow-btn');
        }
    })
});

//5) active side bar option

barLinks.forEach(link=>{
    link.addEventListener('click',function(e){
        barLinks.forEach(ln=> ln.classList.remove('active'));
        e.target.closest('.bar-item').classList.add('active');
       
    
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////

//functionality


/* const followBTn = function(){
    

    if(btnFollowProfile.classList.contains('btn-follow-profile')){ 

        //1)change btn ui
        btnFollowProfile.classList.remove('btn-follow-profile');
        btnFollowProfile.classList.add('btn-following-profile');
        btnFollowProfile.textContent = 'Following';

        //2)add user as following

    }

    else{

        //1) change btn ui
        btnFollowProfile.classList.remove('btn-following-profile');
        btnFollowProfile.classList.add('btn-follow-profile');
        btnFollowProfile.textContent = 'Follow';
       

        //2) remove user from following 

    }



} */

///////////////////////////////////////////////////// rendering profile main infos ///////////////////

const getMainInfo = function(){
    const userData = JSON.parse(localStorage.getItem('user-data') );
    renderMainInfo(userData);
    
}

const renderMainInfo = function(data){
    const markup = `
    <img  src=${data.photo} alt="user profile picture" class="circle-profile-img">
                   <a href="changePhoto.html">
                        <i class="fa-solid fa-camera current-camera-icon"></i> 
                   </a>
                   <button class="follow-following btn-follow-profile user-Events">My Events</button>
                   
                   <div class="inside  text-center"> 
                        <h2 class="user-name mt-1 p-2 pb-1 fw-bold">${data.name}</h2>
                        
                            <p class="user-bio pb-1">${data.bio} </p>
                            
                        
                        <div class="info  main-info fs-4">
                            <div class="podcasts"> ${localStorage.getItem('numberOfMyPodcasts')? localStorage.getItem('numberOfMyPodcasts') : 0} <br> <span class="active podcasts">Podcasts</span></div>
                            <div class="followers"> ${data.followers} <br> <span class="followers">Followers</span></div>
                            <div class="following"> ${data.following}<br> <span class="following">Following</span></div>
                        </div>
                        
                        <a href="edit-profile.html"> <button class="follow-following btn-follow-profile">Edit Profile</button></a>
                    </div>
                  `;
    
    // podcastComponentHeading.innerHTML = `
    //             ${JSON.parse(localStorage.getItem('user-data')).name}'s Podcasts
    //             <button class="add-podcast-btn">
    //                     <i class="fa-solid fa-circle-plus fs-3 me-4"></i>
    //                     Add podcast
    //                 </button>
    //                 `;
    profileVeiw.innerHTML = '';
    //clearLoader();
    profileVeiw.insertAdjacentHTML("beforeend",markup);
    //document.querySelector('.follow-following').addEventListener('click',followBTn);
    document.querySelector('.main-info').addEventListener('click',hideDisplaySideInfo);
}







//////////////////////////////////////////////////////////// uploading podcast ///////////////////////////////////////////////


const podcastInfosForm = async function(file){
    const podName = document.getElementById('podcast-name').value;
    const podCategory = document.getElementById('podcast-category').value;
    if(podName == '') {
        alert('podcast Must Have a Name!');

    }
    else{
        console.log(podName,podCategory);
        podcastPopup.classList.add('hidden');
        addPodcast.textContent = 'Loadding podcast...';
        await uploadPodcast(file,podName,podCategory);
        addPodcast.innerHTML = `<i class="fa-solid fa-circle-plus fs-3 me-4"></i>
        Add podcast`;
        file.value = null;
        init();
        
    }
    
    

}


const uploadPodcastContain = async function(){
    podcastPopup.classList.remove('hidden');

    document.querySelector('.popup-overlay').addEventListener('click',(e)=>{
        if(!e.target.classList.contains('popup-overlay')) return;
    
        podcastPopup.classList.add('hidden');
    })

    document.getElementById('upload-podcast').addEventListener('click',  function(e){
        e.preventDefault();
        podcastInfosForm(file);
    });

}

const triggerUploadPodcast = function(){
    document.getElementById('podcast-file').addEventListener('change',uploadPodcastContain);
}




//////////////////////////////////////////// render podcasts //////////////////////////////////


const getDuration = function(duration){
    let h = duration>=3600? duration/60 :0;

    let m = duration>=60? Math.round(duration/60): 0;
    
    return `${h}h ${m}m`;
}


const podcastMarkup = function(podcastData){
    const duration = getDuration(podcastData.audio.duration);
    // console.log(duration);
    return `
    <div class="podcast-component" data-id=${podcastData._id} data-name=${podcastData.name}>
                            <div class="pic" title="open podcats in podcasts player">
                                <a href="../podcasts/play-podcasts.html#${podcastData._id}" target="_blank">
                                 <img src=${podcastData.createdBy.photo} alt="user podcast">
                                </a>
                            </div>
                            <div class="description p-2"> 
                                <div class="podcast-name text-light fw-bold  fs-5">${podcastData.name}</div>
                                <p class="p-1 ">By <span class="fw-bold">${podcastData.createdBy.name}</span></p>
                                <div class="likes">
                                    <p>${podcastData.likes}</p>
                                    <i class="fa-solid fa-heart fa-2x"></i>
                                </div>
                                <hr>
                                <div class="inner-infos">

                                    <div class="d-flex justify-content-between info"> 
                                        <div class="d-flex">
                                            <img src="../../assets/squareIcon.svg" alt="icon">
                                            <p class="category">${podcastData.category}</p>
                                        </div>
                                        <img src="../../assets/cloud-download.svg" style ="cursor:pointer" alt="">
                                    </div>

                                    <div class="d-flex justify-content-between info"> 
                                        <div class="d-flex">
                                            <img src="../../assets/clock.svg" alt="">
                                            <p class="duration">${duration}</p>
                                        </div>
                                        <button class="play-podcast-btn" id="play-podcast-btn-${podcastData._id}">
                                            <img src="../../assets/circle-play-solid.svg" alt="" >
                                            Play</button>
                                    </div> 

                                </div>
                            </div>  
                            <!--if current-->
                            <div class="delete-pod" >
                                <i class="fa-solid fa-trash-can delete-icon text-light fs-2 p-2 me-3"></i>
                            </div>

                        </div>

    `;

}


const fetchPodcasts =  async function(){
    
    try{
        const response = await fetch(`${url}/api/v1/podcasts/me`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            }
    });

    const res = await response.json();
    localStorage.setItem('myPodcasts',JSON.stringify(res.data));
    localStorage.setItem('numberOfMyPodcasts',JSON.stringify(res.results));
    

}
    catch(err){
        console.log(err);
    }
}

const renderPodcasts = async function(){
    podcastContainerProfile.innerHTML = '';
    loadSpinner(podcastContainerProfile);

    const markup = `
     <p class="emptyMessage">
        its empty here..
     </p>
    `;
    
    //1)fetch data
    await fetchPodcasts();
    
    //2)render podcasts
    const podcastData = await JSON.parse(localStorage.getItem('myPodcasts'));
    
    //podcastData
    
    if(podcastData.length !=0)
        {podcastData.forEach(pod=>{
            clearLoader();
            clearLoader();
            podcastContainerProfile.insertAdjacentHTML('beforeend', podcastMarkup(pod));
            
            //podcasts player
            playPodcastBtn = document.querySelector(`#play-podcast-btn-${pod._id}`)
            playPodcastBtn.addEventListener('click', () => {
                if(podPlayerContainer){
                    podPlayerContainer.parentElement.removeChild(podPlayerContainer)
                }
                insertPodPlayerElement(pod.audio.url, pod.name)
                // console.log(e.target, playPodcastBtn)
            })
        })}

        else{ 
            clearLoader();
            podcastContainerProfile.insertAdjacentHTML('beforeend', markup);
            clearLoader();
        }
    
}

//podcast player markup
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


///////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////// rendering Events ////////////////////////

export const displayPost = function(event){
    const postMarkup = `
    <div class="popup-box">
            <img src=${event.createdBy.photo} alt="user photo">
            <p class="fw-bold ms-3">Happining on <br> <span class="post-date">${getDate(event.date)}</span></p>
            <div class="post-main-content text-center">
                <h1 class="post-userName">${event.createdBy.name}</h1>
                <p class="post-name">${event.name}</p>
                <div class="post-description-container">
                    <p class="post-description-data text-start">${event.description}</p>
                </div>
            </div>   
    </div>
    
    `;

    const postParent = document.querySelector('.event-post-popup-overlay');
    postParent.innerHTML = '';
    postParent.classList.remove('hidden');
    postParent.insertAdjacentHTML('beforeend',postMarkup);
    document.querySelector('.event-post-popup-overlay').addEventListener('click',function(e){
        if(e.target.classList.contains('event-post-popup-overlay')){
            document.querySelector('.event-post-popup-overlay').classList.add('hidden');
        }
    });

}

export const eventpreView = function(event){
    clearLoader();
    const eventPrevMarkup = `
    <div class="event-component" data-podid= ${event._id}>
        <img src=${event.createdBy.photo} alt="">
        <h4 class="text-center m-3">${event.createdBy.name}</h4>
        <p >Topic : <span>${event.name}</span> </p>
        <p>Date: <span>${getDate(event.date)}</span></p>
        <div class="text-center">
            <p class="displayPost">See Post</p>
        </div>
    </div>
`;

    document.querySelector('.event').insertAdjacentHTML('beforeend',eventPrevMarkup);

    document.querySelectorAll('.displayPost').forEach(post=> {
        post.addEventListener('click',function(e){
            getEventById(e.target.closest('.event-component').dataset.podid);
        });
    })

}

const renderEventsMain = function(){
    document.querySelector('.user-Events').addEventListener('click',function(){
        document.querySelector('.event').innerHTML='';
        loadSpinner(document.querySelector('.event'));
        displayEvents();
        getMyEvents();
    });
    
}




//////////////////////////////////////////// render following //////////////////////////////////

const markup = `
     <p class="emptyMessage">
        its empty here..
     </p>
    `;

const followingMarkup = function(f){
    return `
        <li class="d-flex justify-content-between">
                                <div class="d-flex"> 
                                    <img src=${f.photo} alt="">
                                    <p >${f.name} <br> <span>${f.followers ? f.followers : 0} ${f.followers==1? 'Follower': 'Followers'}</span> </p>
                                </div>
                                <div> 
                                    <button class="cBtn following-btn">Following</button>
                                </div>
                            </li>

    `;
}




const renderFollowing = async function(){
    //1)fetch data
    await fetchFollowing();
    followingContainer.innerHTML = '';
    //2)render podcasts
    const followingData = await JSON.parse(localStorage.getItem('my-following'));

    //followingData
    followingData.length !=0? 
    followingData.forEach(f=>{
        followingContainer.insertAdjacentHTML('beforeend', followingMarkup(f.following));
    }) :
    followingContainer.insertAdjacentHTML('beforeend', markup);
    
}






//////////////////////////////////////////// render my followers //////////////////////////////////

const followersMarkup = function(f){
    return `
    <li class="d-flex justify-content-between">
                                <div class="d-flex"> 
                                    <img src=${f.photo} alt="">
                                    <p >${f.name} <br> <span>${f.following?f.followers : 0} ${f.following==1? 'Follower': 'Followers'}</span> </p>
                                </div>
                                <div> 
                                    <button class="cBtn following-btn">Following</button>
                                </div>
                            </li>

    `;
}



const renderFollowers = async function(){
    //1)fetch data
    await fetchFollowers();
    followersContainer.innerHTML = '';
    //2)render podcasts
    const followersgData = await JSON.parse(localStorage.getItem('my-followers'));

    //followersgData
    followersgData.length !=0? 
    followersgData.forEach(f=>{
        followersContainer.insertAdjacentHTML('beforeend', followersMarkup(f.follower));
    }):
    followersContainer.insertAdjacentHTML('beforeend', markup);
    
}


/////////////////////////////////////////////////////// delete podcast /////////////////////

//get podcast Id

const getPodcastId = function(){
    document.querySelectorAll('.delete-pod').forEach(delPod=>{
        delPod.addEventListener('click',function(e){
            const pod = e.target.closest(".podcast-component");
            console.log(pod.dataset.id);
            deletePodcastPopup(pod);
         }); 
        
    });
}

const deletePodcastPopup =  function(podcast){

    document.querySelector('.delete-podcast-popup-overlay').classList.remove('hidden');
    document.querySelector('.del-pod-name').textContent = `${podcast.dataset.name}`

    document.getElementById('cancel-deleation').addEventListener('click',()=>document.querySelector('.delete-podcast-popup-overlay')
            .classList.add('hidden'));

    document.getElementById('confirm-deleation').addEventListener('click', async function(){
        deletePodcast(podcast.dataset.id);
        document.querySelector('.delete-podcast-popup-overlay').classList.add('hidden');
        await getMe();
        renderPodcasts();

    });
    

}


//////////////////////////////////////////////////////////// get user's data onload ///////////////////////////////////////////////

const init = async function(){
   loadSpinner(profileVeiw);
   await getMe();
  // clearLoader();
   await renderPodcasts();
   getPodcastId();
   await renderFollowing();
   await renderFollowers();
   loadSpinner(profileVeiw);
   getMainInfo();
   renderEventsMain();
   triggerUploadPodcast();
}

window.addEventListener('load', () => {
    sideBarView(profileSideBarHref, profileSideBar)
    init()
});



