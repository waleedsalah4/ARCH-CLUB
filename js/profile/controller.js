
import { getMe, url  ,uploadPodcast,fetchFollowing , fetchFollowers} from '../utilities/requests.js';


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
const podcastContainer = document.getElementById('podcast-container');
const followingContainer = document.getElementById('following-container');
const followersContainer = document.getElementById('followers-container');
const podcastPopup = document.querySelector('.popup-overlay-podcast');
const file = document.getElementById('podcast-file');
///////////////////////////////////////////////////////////////////////////////////////////////////

//event handlers

//1)open and close side bar functionality
bar.addEventListener('click',function(e){
    if((e.target.matches('svg') || e.target.matches('path') )&& e.target.classList.contains('bar-icon')){ 
        bar.classList.toggle('opened');
    }

    if(!bar.classList.contains('opened')){
        barLinks.forEach(ln=>ln.classList.remove('highlight')) ;
        const active = Array(...barLinks).filter(ln=> ln.classList.contains('active'))[0];
        active.classList.toggle('highlight');
    }

    else{
        barLinks.forEach(ln=>ln.classList.remove('highlight')) ;
    }
    
});


//2)active link (podcast , followers , following) and show its content

const hideDisplaySideInfo =  function(e){
    
    if(e.target.matches('span') ){
        
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


const followBTn = function(){
    

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



}

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
                   
                   <div class="inside  text-center"> 
                        <h2 class="user-name mt-4 p-5 pb-4 fw-bold">${data.name}</h2>
                        <div class="info  main-info fs-4">
                            <div class="podcasts"> ${localStorage.getItem('numberOfMyPodcasts')? localStorage.getItem('numberOfMyPodcasts') : 0} <br> <span class="active podcasts">Podcasts</span></div>
                            <div class="followers"> ${data.followers} <br> <span class="followers">Followers</span></div>
                            <div class="following"> ${data.following}<br> <span class="following">Following</span></div>
                        </div>
                        
                        <a href="edit-profile.html"> <button class="follow-following btn-follow-profile">Edit Profile</button></a>
                    </div>
                  `;
    
    podcastComponentHeading.innerHTML = `
                ${JSON.parse(localStorage.getItem('user-data')).name}'s Podcasts
                <button class="add-podcast-btn">
                        <i class="fa-solid fa-circle-plus fs-3 me-4"></i>
                        Add podcast
                    </button>
                    `;

    profileVeiw.insertAdjacentHTML("beforeend",markup);
    document.querySelector('.follow-following').addEventListener('click',followBTn);
    document.querySelector('.main-info').addEventListener('click',hideDisplaySideInfo);
}







//////////////////////////////////////////////////////////// uploading podcast ///////////////////////////////////////////////

const podcastInfosForm = function(file){
    const podName = document.getElementById('podcast-name').value;
    const podCategory = document.getElementById('podcast-category').value;
    if(podName == '') {
        alert('podcast Must Have a Name!');

    }
    else{
        console.log(podName,podCategory);
        uploadPodcast(file,podName,podCategory);
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


document.getElementById('podcast-file').addEventListener('change',uploadPodcastContain);


//////////////////////////////////////////// render podcasts //////////////////////////////////
const messageEmptyMarkup = function(){
    return `
     <p class="emptyMessage">
        its empty here..
     </p>
    `;
}

const getDuration = function(duration){
    let h = duration>=3600? duration/60 :0;

    let m = duration>=60? Math.round(duration/60): 0;
    
    return `${h}h ${m}m`;
}

const podcastMarkup = function(podcastData){
    const duration = getDuration(podcastData.audio.duration);
    console.log(duration);
    return `
    <div class="podcast-component">
                            <div class="pic">
                                <img src=${podcastData.createdBy.photo} alt="user podcast">
                            </div>
                            <div class="description p-2">
                                <div class="podcast-name text-light fw-bold  fs-5">${podcastData.name}</div>
                                <p class="p-1 ">By <span class="fw-bold">${podcastData.createdBy.name}</span></p>
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
                                        <button class="play-podcast-btn">
                                            <img src="../../assets/circle-play-solid.svg" alt="" >
                                            Play</button>
                                    </div> 

                                </div>
                            </div>  
                            <!--if current-->
                            <i class="fa-solid fa-trash-can delete-icon text-light fs-2 p-2 me-3"></i>

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
    //1)fetch data
    await fetchPodcasts();

    //2)render podcasts
    const podcastData = await JSON.parse(localStorage.getItem('myPodcasts'));

    //podcastData
    podcastData.length !=0?
    podcastData.forEach(pod=>{
        podcastContainer.insertAdjacentHTML('beforeend', podcastMarkup(pod));
    }):
    podcastContainer.insertAdjacentHTML('beforeend', messageEmptyMarkup);
    
}




///////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////// render following //////////////////////////////////

const followingMarkup = function(f){
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




const renderFollowing = async function(){
    //1)fetch data
    await fetchFollowing();

    //2)render podcasts
    const followingData = await JSON.parse(localStorage.getItem('my-following'));

    //followingData
    followingData.length !=0? 
    followingData.forEach(f=>{
        followingContainer.insertAdjacentHTML('beforeend', followingMarkup(f.following));
    }) :
    followingContainer.insertAdjacentHTML('beforeend', messageEmptyMarkup);
    
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

    //2)render podcasts
    const followersgData = await JSON.parse(localStorage.getItem('my-followers'));

    //followersgData
    followersgData.length !=0? 
    followersgData.forEach(f=>{
        followersContainer.insertAdjacentHTML('beforeend', followersMarkup(f.follower));
    }):
    followersContainer.insertAdjacentHTML('beforeend', messageEmptyMarkup);
    
}




//////////////////////////////////////////////////////////// get user's data onload ///////////////////////////////////////////////



window.addEventListener('load',async function(){
   await getMe();
   await renderPodcasts();
   await renderFollowing();
   await renderFollowers();
   getMainInfo();
});



