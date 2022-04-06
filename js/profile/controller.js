
import { getMe, url  ,uploadPodcast,fetchFollowing , fetchFollowers, getUserFollowing,getUserFollowers,
        deletePodcast,getOtherUser,getMyEvents,getEventById,getUser,getUserPodcasts} from '../utilities/profileReq.js';
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

const hideDisplaySideInfo =  function(e,userName=''){
    
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
                ${userName===''? 
                `${JSON.parse(localStorage.getItem('user-data')).name}'s Podcasts <br>
                <button class="add-podcast-btn">
                        <i class="fa-solid fa-circle-plus fs-3 me-4"></i>
                        Add podcast
                    </button>`:
                `${userName}'s  Podcasts`}
                    `;

                document.querySelector(`.${hideDisplaySide[0]}`).classList.remove('hidden');
            }

            //2) if followers
            if(e.target.classList.contains('followers')) {
                //change heading
                podcastComponentHeading.textContent = `${userName===''? `${JSON.parse(localStorage.getItem('user-data')).name}`: ` ${userName}` }'s Followers`;
                document.querySelector(`.${hideDisplaySide[1]}`).classList.remove('hidden');
            }

            //3)if following
            if(e.target.classList.contains('following')) {
                //change heading
                podcastComponentHeading.textContent = `${userName===''? `${JSON.parse(localStorage.getItem('user-data')).name}`: ` ${userName}` }'s Following`;
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

export const sideOtherUser = function(name){
    podcastComponentHeading.innerHTML = `${name}'s  Podcasts`;
}

const sideContentStatic = function(name=JSON.parse(localStorage.getItem('user-data')).name){
    const markup = `
        ${name}'s Podcasts <br>
        <button class="add-podcast-btn" onclick="document.getElementById('podcast-file').click()">
            <i class="fa-solid fa-circle-plus fs-3 me-4"></i>
            Add podcast
        </button>
    `;
    document.querySelector('.podcast-component-heading').innerHTML = '';
    document.querySelector('.podcast-component-heading').insertAdjacentHTML('beforeend',markup);
}


export const renderMainInfo = function(data,otherUser=false){
    

    const markup = `
    <img  src=${data.photo} alt="user profile picture" class="circle-profile-img">
                  ${otherUser === false? `<a href="changePhoto.html">
                  <i class="fa-solid fa-camera current-camera-icon"></i> 
                    </a>`: ``}
                   
                   
                   
                   <div class="inside  text-center"> 
                        <h2 class="user-name mt-1 p-2 pb-1 fw-bold">${data.name}</h2>
                        
                            <p class="user-bio pb-1">${data.bio} </p>
                            
                        
                        <div class="info  main-info fs-4">
                            <div class="podcasts"> 
                            ${localStorage.getItem('numberOfMyPodcasts')? localStorage.getItem('numberOfMyPodcasts') : 0}<br> <span class="active podcasts">Podcasts</span>
                            </div>
                            <div class="followers"> ${data.followers} <br> <span class="followers">Followers</span></div>
                            <div class="following"> ${data.following}<br> <span class="following">Following</span></div>
                        </div>
                        <div class='d-flex' style="justify-content:space-evenly" >
                        <button class="follow-following btn-follow-profile user-Events ${otherUser!=false? `invisible`:``}" > My Events</button>
                        ${otherUser===true? `<button class="follow-following ${data.isFollowed? 'btn-following-profile' : 'btn-follow-profile'}"> ${data.isFollowed?'Following' : 'Follow' }</button>` :
                         '<a href="edit-profile.html"> <button class="follow-following btn-follow-profile">Edit Profile</button></a>'}
                        </div>
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
    document.querySelector('.main-info').addEventListener('click',function(e){
        if(otherUser!= false){
            //const userId = window.location.href.slice(53);
            
            hideDisplaySideInfo(e,data.name);
        }
        else{
            
            hideDisplaySideInfo(e);
        }
        
    }
        );
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


const podcastMarkup = function(podcastData,otherUser){
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
                            ${otherUser === false? `<div class="delete-pod" >
                            <i class="fa-solid fa-trash-can delete-icon text-light fs-2 p-2 me-3"></i>
                            </div>`: ``}
                            

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

export const renderPodcasts = async function(podcastData ,otherUser = false,numOfPods){

    if(otherUser){
        document.querySelector('.podcasts').innerHTML = '';
        document.querySelector('.podcasts').innerHTML =`
            ${numOfPods}<br> <span class="active podcasts">Podcasts</span>
        ` ;
    }
    

    podcastContainerProfile.innerHTML = '';
    loadSpinner(podcastContainerProfile);

    const markup = `
     <p class="emptyMessage">
        its empty here..
     </p>
    `;
    
    if(otherUser=== false){
        //1)fetch data
    await fetchPodcasts();
    
    //2)render podcasts
     podcastData = await JSON.parse(localStorage.getItem('myPodcasts'));
    }
    
    
    //podcastData
    
    if(podcastData.length !=0)
        {podcastData.forEach(pod=>{
            clearLoader();
            clearLoader();
            podcastContainerProfile.insertAdjacentHTML('beforeend', podcastMarkup(pod,otherUser));
            
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
        getMyEvents(document.querySelector('.event'));
        clearLoader()
    });
    
}




//////////////////////////////////////////// render following //////////////////////////////////

const markup = `
     <p class="emptyMessage">
        its empty here..
     </p>
    `;

const followingMarkup = function(f){
    // console.log(f.isFollowed);
    return `
        <li class="d-flex justify-content-between">
                                <div class="d-flex"> 
                                    <img src=${f.photo} alt="">
                                    <p > <a class="userLink" href="./index.html?id=${f._id}"> ${f.name}<a/> <br> <span>${f.followers ? f.followers : 0} ${f.followers==1? 'Follower': 'Followers'}</span> </p>
                                </div>
                                 
                            </li>

    `;
}




export const renderFollowing = async function(followingData,otherUser = false){
    
    followingContainer.innerHTML = '';
    if(otherUser === false){
        //1)fetch data
    await fetchFollowing();
    
    //2)render podcasts
     followingData = await JSON.parse(localStorage.getItem('my-following'));

    }
    
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
                                    <p ><a class="userLink" href="./index.html?id=${f._id}"> ${f.name}<a/> <br> <span>${f.following?f.followers : 0} ${f.following==1? 'Follower': 'Followers'}</span> </p>
                                </div>
                                
                            </li>

    `;
}



export const renderFollowers = async function(followersgData,otherUser = false){
    followersContainer.innerHTML = '';
    if(otherUser === false){
        //1)fetch data
    await fetchFollowers();
    
    //2)render podcasts
     followersgData = await JSON.parse(localStorage.getItem('my-followers'));

    }
    
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
    sideContentStatic();
   loadSpinner(profileVeiw);
   await getMe();
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
    // console.log(profileSideBar)

    //solved by omar 😂
    const queryArr = window.location.search.slice(1).split('&')
    const queryParams = {}
    queryArr.forEach(elem => {
      let [key, value] = elem.split('=')
      queryParams[key] = value
    })

    sideBarView(profileSideBarHref, profileSideBar);
    
    if(queryParams.id){
        if(queryParams.id === JSON.parse(localStorage.getItem('user-data'))._id ){
            window.location.href = './index.html';
            init();
        }
        else{
            getUser(queryParams.id);
            getUserPodcasts(queryParams.id);
            getUserFollowers(queryParams.id);
            getUserFollowing(queryParams.id);
        }
        
    }
    else{ 
        init();
    }

});



