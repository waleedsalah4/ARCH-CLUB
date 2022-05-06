import { sideBarView } from "../sideBar/sideBarView.js";
import { snackbar } from "../utilities/snackbar.js";
import { playPodcastsSideBarHref } from "../sideBar/sideBarHref.js";
const token = JSON.parse(localStorage.getItem('user-token'))
// const tempId = '62320d4813eb0800162867f7'
const podcastId = window.location.hash.replace('#', '');

//add side bar
const playPodcastsSidebar = document.querySelector('#play-podcasts-sidebar')


//run when window loads
const chechIfUserIsSign = () => {
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'))
    if(isLoggedIn === true) {
        return
    } else{
        window.location = '/';
    }
}
chechIfUserIsSign()

window.addEventListener('load', () =>{
    sideBarView(playPodcastsSideBarHref, playPodcastsSidebar)
 });

//----
const podcastContainer = document.querySelector('.podcast-container')

//variable gonna assigned after elements inserted to the dom
let liked_track;
let playpause_btn;
let forwardTrack;
let backwardTrack;
let userImg ;

let seek_player;
let volume_player;
let curr_time ;
let duration;
let total_duration;
let wave ;

//creat audio element
let curr_track = document.createElement('audio');

//player variables
let track_index;
let setTrack;
let isPlaying = false;
let updateTimer;


const displayPodPlayer = (data) => {
    const markup = `
    <div class="user-info">
            <div class="user-img">
                <img id="user-img" src="../../assets/user.jpg" alt="user-img" >
            </div>
            <div class="user-name">
                <h3>${data.createdBy.name}</h3>
                <p>${data.name}</p>
            </div>
        </div>
        <div class="player-container">
            <div class="current-time">00:00</div>
            <input type="range" min="1" max="100" class="seek_player" id="seek_player">
            <div class="total-duration">00:00</div>
        </div>
        <div class="player-container">
            <i class="fa-solid fa-volume-low"></i>
            <input type="range" min="1" max="100" value="99" class="volume_player">
            <i class="fa-solid fa-volume-high"></i>
        </div>
        <div class="player-buttons">
            <div class="like-track ${data.isLiked ? 'liked' : ''}">
                <i id="heart-icon" class="fa-solid fa-heart fa-2x"></i>
            </div>
            <div class="prev-track">
                <i class="fa-solid fa-backward fa-2x"></i>
            </div>
            <div class="playpause-track">
                <i class="fa-solid fa-circle-play fa-3x"></i>
            </div>
            <div class="next-track">
                <i class="fa-solid fa-forward fa-2x"></i>
            </div>
            <div class="repeat-track">
                <i class="fa-solid fa-rotate-right fa-2x"></i>
            </div>
        </div>
        <div id="wave" class="wave-loader">
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
        </div>
    `
    podcastContainer.insertAdjacentHTML('beforeend', markup)
    playpause_btn = document.querySelector('.playpause-track')
    forwardTrack = document.querySelector('.next-track')
    backwardTrack = document.querySelector('.prev-track')
    userImg = document.querySelector('#user-img')
    liked_track = document.querySelector('.like-track')

    seek_player = document.querySelector('.seek_player');
    volume_player = document.querySelector('.volume_player')
    curr_time = document.querySelector('.current-time')
    total_duration = document.querySelector('.total-duration')
    wave = document.getElementById('wave');

    playpause_btn.addEventListener('click', ()=>{
        playpauseTrack()
    })

    document.querySelector('.repeat-track').addEventListener('click', () => {
        repeatTrack()
    })

    volume_player.addEventListener('click', ()=> {
        setVolume()
    })

    seek_player.addEventListener('click', () => {
        seekTo()
    })

    forwardTrack.addEventListener('click', ()=>{
        increaseSec()
    })
    backwardTrack.addEventListener('click', ()=>{
        decreaseSec()
    })

    // console.log(likedIcon)
    liked_track.addEventListener('click', ()=>{
        if(liked_track.classList.contains('liked')){
            disLikePodcastById(token, podcastId)
        } else {
            likePodcastById(token, podcastId)
        }
    })

}






const likePodcastById = async(token, id) => {
    try{
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/podcasts/likes/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            liked_track.classList.add('liked')
        }
        else{
            snackbar(podcastContainer,'error', `<b>Error: </b> Somthing went wrong, please try again `, 5000);
        }
    } catch(error) {
        snackbar(podcastContainer,'error', `<b>Error: </b> Somthing went wrong, please try again `, 5000);
    }
}

const disLikePodcastById = async(token, id) => {
    try{
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/podcasts/likes/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            liked_track.classList.remove('liked')
        }
        else{
            snackbar(podcastContainer,'error', `<b>Error: </b> Somthing went wrong, please try again `, 5000);
        }
    }  catch(error) {
        snackbar(podcastContainer,'error', `<b>Error: </b> Somthing went wrong, please try again `, 5000);
    }
}


const getPodcastbyId = async(token, id) => {
    try {
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/podcasts/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            console.log(res);
            const {data} = res;
            displayPodPlayer(data)
            setTrack = data.audio.url
            loadTrack(setTrack)
            duration= data.audio.duration;
        }
        else{
            console.log(res.message)
            snackbar(podcastContainer,'error', `<b>Error: </b> Invalid data `, 5000);
        }
    } catch(error) {
        console.log(error.message)
        snackbar(podcastContainer,'error', `<b>Error: </b>  ${error.msg}`, 5000);
    }
}

getPodcastbyId(token, podcastId)



//player
function loadTrack(track_index) {
    clearInterval(updateTimer);
    reset();

    curr_track.src = track_index;
    curr_track.load();

    updateTimer = setInterval(setUpdate, 1000)

    curr_track.addEventListener('ended', ()=> {
        userImg.classList.remove('rotate');
        wave.classList.remove('show-loader')
       // playpause_btn.innerHTML = `<i class="fa-solid fa-circle-play fa-3x"></i>`
    })
}

function reset() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_player.value = 0;
}

function repeatTrack() {
    curr_track.src = '';
    let current_index = setTrack;
    loadTrack(current_index);
    playTrack();
}

function playpauseTrack() {
    isPlaying ? pauseTrack() : playTrack()
}

function playTrack() {
    curr_track.play();
    isPlaying = true;
    userImg.classList.add('rotate');
    wave.classList.add('show-loader')
    playpause_btn.innerHTML = '<i class="fa-solid fa-circle-pause fa-3x"></i>'
}
function pauseTrack() {
    curr_track.pause();
    isPlaying = false;
    userImg.classList.remove('rotate');
    wave.classList.remove('show-loader')
    playpause_btn.innerHTML = `<i class="fa-solid fa-circle-play fa-3x"></i>`
}

function seekTo() {
    let seekto = duration * (seek_player.value / 100);
    curr_track.currentTime = seekto;
}

function increaseSec () {
    if(curr_track.currentTime < curr_track.duration -5){
        curr_track.currentTime += 5 

    }
}

function decreaseSec () {
    if(curr_track.currentTime > 5){
        curr_track.currentTime -= 5 

    }
}

function setVolume() {
    curr_track.volume =  document.querySelector('.volume_player').value / 100;
}
function setUpdate() {
    let seekPosition = 0
    if(!isNaN(duration)) {
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_player.value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        if(currentSeconds < 10) {currentSeconds = "0" + currentSeconds; }
        if(durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if(currentMinutes < 10) {currentMinutes = "0" + currentMinutes; }
        if(durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationMinutes;
    }
}



