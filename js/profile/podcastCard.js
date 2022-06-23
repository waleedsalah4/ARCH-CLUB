import { insertPodPlayerElement } from './controller.js';
import { limiTitle } from '../podcast/podcastsView.js';
import { deletePodcast } from '../utilities/profileRequests.js';
import { likePodcast, disLikePodcast } from '../utilities/LikePodcats.js';

export const podcastCard = (podcastData, conatiner, otherUser) => {
  
    const markup = `
    <div class="podcast-component" id="podcast-component-${podcastData._id}" data-name=${podcastData.name}>
        <div class="pic" title="open podcats in podcasts player">
            <a href="../podcasts/play-podcasts.html#${podcastData._id}" target="_blank">
            <img src=${podcastData.createdBy.photo} alt="user podcast">
            </a>
        </div>
        <div class="description p-2"> 
            <div class="disc-header">
                <div class="podcast-name text-light fw-bold">${limiTitle(podcastData.name)}</div>
                ${otherUser === false? `<div class="delete-pod" id="delete-${podcastData._id}">
                    <i class="fa-solid fa-trash-can delete-icon text-light fs-2 p-2"></i>
                </div>`: ``}
            </div>

            <div class="d-flex justify-content-between mt-3">
                <p class="p-1 ">By <span class="fw-bold"><a class="userLink" href="./index.html?id=${podcastData.createdBy._id}">${podcastData.createdBy.name}</a></span></p>
                <div class="likes">
                    <p id="podLikesNums-${podcastData._id}">${podcastData.likes}</p>
                    <div class="likesIcon ${podcastData.isLiked ? 'isLiked' : ''}" id="isLikedPod-${podcastData._id}">
                        <i class="fa-solid fa-heart fa-2x"></i>
                    </div>
                </div>
            </div>
            <hr>
            <div class="inner-infos">

                <div class="d-flex justify-content-between"> 
                    <div class="d-flex">
                        <img src="../../assets/squareIcon.svg" alt="icon">
                        <p class="category">${podcastData.category}</p>
                    </div>
                    <a href="${podcastData.audio.url}" download="${podcastData.name}">
                        <img src="../../assets/cloud-download.svg" alt="download">
                    </a>
                </div>

                <div class="d-flex justify-content-between"> 
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
    </div>
    `
    conatiner.insertAdjacentHTML('beforeend', markup)


    //insert pod player
    document.querySelector(`#play-podcast-btn-${podcastData._id}`).addEventListener('click', () => {
        if(document.querySelector('.pod-palyer-container')){
            document.querySelector('.pod-palyer-container').parentElement.removeChild(document.querySelector('.pod-palyer-container'))
        }
        insertPodPlayerElement(podcastData.audio.url, podcastData.name)
        // console.log(e.target, playPodcastBtn)
    })

    //delete podcasts
    if(document.querySelector(`#delete-${podcastData._id}`)){
        document.querySelector(`#delete-${podcastData._id}`).addEventListener('click', () =>{
            deletePodcast(podcastData._id)
        })
    }

    //like
    document.querySelector(`#isLikedPod-${podcastData._id}`).addEventListener('click', ()=>{
        if(document.querySelector(`#isLikedPod-${podcastData._id}`).classList.contains('isLiked')) {
            // console.log('do unlike req')
            disLikePodcast(
                podcastData._id,
                document.querySelector(`#isLikedPod-${podcastData._id}`),
                document.querySelector(`#podLikesNums-${podcastData._id}`),
                document.querySelector('#snackbar-container')
            )
        } else{
            // console.log('do like req')
            likePodcast(
                podcastData._id,
                document.querySelector(`#isLikedPod-${podcastData._id}`),
                document.querySelector(`#podLikesNums-${podcastData._id}`),
                document.querySelector('#snackbar-container')
            )
        }
    })

}



export const deletePodcatsFromUI = (id) => {
    if(document.querySelector(`#podcast-component-${id}`)){
        console.log('deleted')
        document.querySelector(`#podcast-component-${id}`).parentElement.removeChild(document.querySelector(`#podcast-component-${id}`))
    }
}