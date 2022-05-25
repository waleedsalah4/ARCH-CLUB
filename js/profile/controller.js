
import { getMe, url  ,uploadPodcast,fetchFollowing , fetchFollowers, getUserFollowing,getUserFollowers,
        deletePodcast,getMyEvents,getUser,getUserPodcasts,fetchPodcasts} from '../utilities/profileReq.js';
import { loadSpinner, clearLoader} from '../loader.js';
import { sideBarView } from '../sideBar/sideBarView.js';
import { profileSideBarHref } from '../sideBar/sideBarHref.js';
import { followUser, unFollowUser} from "../utilities/profileReq.js";
import Follow from './Follow.js';
import PodcastClass from './PodcastClass.js';
import Myevents from './Myevents.js';
//elements
const profileVeiw = document.querySelector('.profile-veiw');
const podcastPopup = document.querySelector('.popup-overlay-podcast');
export const queryParams = {}


///////////////////////////////////////////////////////////////////////////////////////////////////
//side bar element
const profileSideBar = document.querySelector('.insertLinks');


// follow-following general
/* generalBtn.forEach(btn=> {
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
}); */



////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////// rendering profile main infos ///////////////////

const getMainInfo = function(){
    const userData = JSON.parse(localStorage.getItem('user-data') );
    renderMainInfo(userData);
    
}


export const renderMainInfo = function(data,otherUser=false){
    

    const markup = `

            <div d-flex>

                <div class="d-flex fr-wrab">

                        <div>
                        <img  src=${data.photo} alt="user profile picture" class="circle-profile-img">
                                ${otherUser === false? `<a href="changePhoto.html">
                                <i class="fa-solid fa-camera current-camera-icon"></i> 
                                    </a>`: ``}
                        </div>

                        <div class="ms-4 mt-4">
                            <h2 class="user-name mt-1 p-2 pb-1 fw-bold">${data.name}</h2>        
                            <p class="user-bio pb-1">${data.bio} </p>
                        </div>
                        
                        ${otherUser!= false? '':
                        `<div class="add-podcast-container">
                        <input type="file" name="file" id="podcast-file" style="display: none; " >
                        <h2 class="text-light  fw-bold fs-1  podcast-component-heading"> 
                            <button class="add-podcast-btn" onclick="document.getElementById('podcast-file').click()">
                                <i class="fa-solid fa-circle-plus fs-3 me-4"></i>
                                Add podcast
                            </button>
                        </h2>
                    </div>`
                    }
                    

            </div>
            
            ${otherUser===true? `<button class="follow-following f-btn ${data.isFollowed? 'btn-following-profile' : 'btn-follow-profile'}"> ${data.isFollowed?'Following' : 'Follow' }</button>` :
                            '<a href="edit-profile.html"> <button class="follow-following btn-follow-profile">Edit Profile</button></a>'}
                            <div class="mgs-output"></div>
            </div>

            `;
    
    
    profileVeiw.innerHTML = '';
    profileVeiw.insertAdjacentHTML("beforeend",markup);
    clearingNumbers();
    //document.querySelector('.podcasts .tab-number').textContent = numOfPods;
    document.querySelector('.following .tab-number').textContent = data.following;
    document.querySelector('.followers .tab-number').textContent = data.followers;
    showTabContent();
    if(otherUser){
        followUnFollow();
    }
    
    

}

const clearingNumbers = function(){
    document.querySelector('.podcasts .tab-number').textContent = '';
    document.querySelector('.following .tab-number').textContent = '';
    document.querySelector('.followers .tab-number').textContent ='';
}

const showTabContent = function(){
    document.querySelector('.tabs').addEventListener('click', async function(e){
       /*  console.log('clicked');
        console.log(e.target); */
        if( e.target.matches('input')){ //e.target.matches('label') ||
            /* console.log(e.target); */
            const element = e.target;
            Follow.followersPage = 1;
            Follow.followingPage = 1;
            Follow.myFollowersPage = 1;
            Follow.myFollowingPage = 1;
            PodcastClass.podcastPage = 1;
            PodcastClass.mypodcastsPage =1;
            Myevents.eventPage = 1;

            if(element.closest('.tab').classList.contains('podcasts')){
                console.log('podcasts');
                
                document.querySelector('.tab-content').innerHTML = '';
                //loadSpinner(document.querySelector('.tab-content'));
                if(queryParams.id){
                   
                    getUserPodcasts(queryParams.id,document.querySelector('.tab-content'));
                }
                else{
                    fetchPodcasts();
                }
            }

            if(element.closest('.tab').classList.contains('followers')){
                console.log('followers');
                document.querySelector('.followers-content').innerHTML = '';
                if(queryParams.id){
                    getUserFollowers(queryParams.id);
                    
                }
                else{fetchFollowers();}
            }

            if(element.closest('.tab').classList.contains('following')){
                console.log('following');
                document.querySelector('.load-followeing').innerHTML = '';
                document.querySelector('.following-content').innerHTML = '';
                if(queryParams.id){
                   
                    getUserFollowing(queryParams.id);
                }
                else{
                    fetchFollowing();
                }
            }

            if(element.closest('.tab').classList.contains('events')){
                let eventPage = 1
                console.log('events');
                document.querySelector('.events-content').innerHTML='';
                await getMyEvents(document.querySelector('.events-content'));
                clearLoader();
            }
        }


        
    });
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
        setTimeout(init,5000);
        //init();
        
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
        podcastInfosForm(document.getElementById('podcast-file'));
    });

}

const triggerUploadPodcast = function(){
    document.getElementById('podcast-file').addEventListener('change',uploadPodcastContain);
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
        //renderPodcasts();
        await fetchPodcasts(PodcastClass.podcastContainerProfile);

    });
    

}

/////////////////////////////////////////////////////// Paggination //////////////////////////////////////////////////////////////
let eventPage = 1
let loadmore;
const eventContainer = document.querySelector('.events-content')
export const insertLoadMoreEventsBtn = () => {
    const markup =`
        <div class="load-more-events custom-center">
            <button class="load-more-btn ">Load More</button>
        </div>
    `
    eventContainer.insertAdjacentHTML('beforeend', markup)

    loadmore = document.querySelector('.load-more-events')
    loadmore.addEventListener('click', () => {
        eventPage++
        getMyEvents(eventContainer, eventPage,true)
        clearLoadMore(loadmore)
    })
}

const clearLoadMore  = (element) => {
    if(element) {
        element.parentElement.removeChild(element)
    }
    loadmore = null;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////// Follow & UnFollow User//////////////////////////////////////////////////////////

const followUnFollow = function(){
    document.querySelector('.f-btn').addEventListener('click',function(e){
        if(e.target.classList.contains('btn-following-profile')){
            unFollowUser(queryParams.id, document.querySelector('.f-btn'))
        }
        else{
            followUser(queryParams.id, document.querySelector('.f-btn'))
        }
    })
}

//////////////////////////////////////////////////////////// get user's data onload ///////////////////////////////////////////////

const init = async function(){
   loadSpinner(profileVeiw);
   await getMe();
   getMainInfo();
   //loadSpinner(document.getElementById('podcast-container1'));
   await fetchPodcasts();
   getPodcastId();
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
            loadSpinner(profileVeiw);
            document.querySelector('.events').classList.add('hidden');
            getUser(queryParams.id);
            getUserPodcasts(queryParams.id,document.querySelector('.tab-content'));
            //getUserFollowers(queryParams.id);
            //getUserFollowing(queryParams.id);
        }
        
    }
    else{
        document.querySelector('.events').classList.remove('hidden');
        init();
    }

});



