import { loadSpinner, clearLoader} from '../loader.js';

//for podcasts player
let playerContentHolder = document.querySelector('.profile-player-content');
let podPlayerContainer;
let playPodcastBtn;


class PodcastClass{
    podcastContainerProfile = document.getElementById('podcast-container');
    emptyMessageMarkup = `
        <p class="emptyMessage">
        its empty here..
        </p>
    `;

    constructor(){
        loadSpinner(this.podcastContainerProfile);
    }

    renderPodcast(podcastData ,otherUser = false,numOfPods){
        if(otherUser){
            document.querySelector('.podcasts').innerHTML = '';
            document.querySelector('.podcasts').innerHTML =`
                ${numOfPods}<br> <span class="active podcasts">Podcasts</span>
            ` ;
        }
        
    
        this.podcastContainerProfile.innerHTML = '';
        //loadSpinner(this.podcastContainerProfile);
        
       /*  if(otherUser=== false){
        //1)fetch data
        await fetchPodcasts();
        
        //2)render podcasts
         podcastData = await JSON.parse(localStorage.getItem('myPodcasts'));
        } */
        
        
        //podcastData
        
        if(podcastData.length !=0)
            {podcastData.forEach(pod=>{
                clearLoader();
                clearLoader();
                this.podcastContainerProfile.insertAdjacentHTML('beforeend', this.Markup(pod,otherUser));
                
                //podcasts player
                playPodcastBtn = document.querySelector(`#play-podcast-btn-${pod._id}`)
                playPodcastBtn.addEventListener('click', () => {
                    if(podPlayerContainer){
                        podPlayerContainer.parentElement.removeChild(podPlayerContainer)
                    }
                    this.insertPodPlayerElement(pod.audio.url, pod.name)
                    // console.log(e.target, playPodcastBtn)
                })
            })}
    
            else{ 
                clearLoader();
                this.podcastContainerProfile.insertAdjacentHTML('beforeend', this.emptyMessageMarkup);
                clearLoader();
            }
        
    }

    //podcast player markup
    insertPodPlayerElement(podsrc, name) {
    
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
    });
}

    Markup(podcastData,otherUser){
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
                                            <p class="duration">${Math.floor(podcastData.audio.duration / 60)} : ${ Math.floor(podcastData.audio.duration - Math.floor(podcastData.audio.duration / 60) * 60)}</p>
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
}

export default new PodcastClass();