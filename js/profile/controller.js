
import { getMe, url  ,uploadPodcast,fetchFollowing , fetchFollowers, getUserFollowing,getUserFollowers,
        deletePodcast,getOtherUser,getMyEvents,getEventById,getUser,getUserPodcasts,fetchPodcasts} from '../utilities/profileReq.js';
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
const podcastContainerProfile = document.getElementById('podcast-container');
const followingContainer = document.getElementById('following-container');
const followersContainer = document.getElementById('followers-container');
const podcastPopup = document.querySelector('.popup-overlay-podcast');
const file = document.getElementById('podcast-file');
const queryParams = {}
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
                podcastContainerProfile.innerHTML = '';
                loadSpinner(podcastContainerProfile);
                if(queryParams.id){
                    
                    getUserPodcasts(queryParams.id);
                }
                else{
                    fetchPodcasts();
                }
            }

            //2) if followers
            if(e.target.classList.contains('followers')) {
                //change heading
                podcastComponentHeading.textContent = `${userName===''? `${JSON.parse(localStorage.getItem('user-data')).name}`: ` ${userName}` }'s Followers`;
                followersContainer.innerHTML = '';
                document.querySelector(`.${hideDisplaySide[1]}`).classList.remove('hidden');
                if(queryParams.id){
                    getUserFollowers(queryParams.id);
                    
                }
                else{fetchFollowers();}
                
            }

            //3)if following
            if(e.target.classList.contains('following')) {
                //change heading
                podcastComponentHeading.textContent = `${userName===''? `${JSON.parse(localStorage.getItem('user-data')).name}`: ` ${userName}` }'s Following`;
                followingContainer.innerHTML = '';
                document.querySelector(`.${hideDisplaySide[2]}`).classList.remove('hidden');
                if(queryParams.id){
                   
                    getUserFollowing(queryParams.id);
                }
                else{
                    fetchFollowing();
                }
                
            }
            

    }
}

//if events
const displayEvents = function(){
    document.querySelectorAll('.info span').forEach(el=> el.classList.remove('active'));
    hideDisplaySide.forEach((el)=> {if(!document.querySelector(`.${el}`).classList.contains('hidden')) document.querySelector(`.${el}`).classList.add('hidden') });
    document.querySelector('.event-content').classList.remove('hidden');
    

}



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

/* //5) active side bar option

barLinks.forEach(link=>{
    link.addEventListener('click',function(e){
        barLinks.forEach(ln=> ln.classList.remove('active'));
        e.target.closest('.bar-item').classList.add('active');
       
    
    });
}); */

////////////////////////////////////////////////////////////////////////////////////////////////////////

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
        document.querySelector('.add-podcast-btn').textContent = 'Loadding podcast...';
        await uploadPodcast(file,podName,podCategory);
        document.querySelector('.add-podcast-btn').innerHTML = `<i class="fa-solid fa-circle-plus fs-3 me-4"></i>
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

export const eventMainFunction = function(){

    document.querySelector('.event').innerHTML='';
        loadSpinner(document.querySelector('.event'));
        displayEvents();
        getMyEvents(document.querySelector('.event'));
        clearLoader();
}

const renderEventsMain = function(){
    document.querySelector('.user-Events').addEventListener('click',eventMainFunction);
    
}




//////////////////////////////////////////// render following //////////////////////////////////

//////////////////////////////////////////// render my followers //////////////////////////////////


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
        //renderPodcasts();
        await fetchPodcasts();

    });
    

}


//////////////////////////////////////////////////////////// get user's data onload ///////////////////////////////////////////////

const init = async function(){
   sideContentStatic();
   loadSpinner(profileVeiw);
   await getMe();
   //await renderPodcasts();
   await fetchPodcasts();
   getPodcastId();
   //await fetchFollowing();
   //await renderFollowers();
   loadSpinner(profileVeiw);
   getMainInfo();
   renderEventsMain();
   triggerUploadPodcast();
}




window.addEventListener('load', () => {
    // console.log(profileSideBar)

    //solved by omar 😂
    const queryArr = window.location.search.slice(1).split('&')
    //const queryParams = {}
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



