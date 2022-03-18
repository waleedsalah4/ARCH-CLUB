import { loadSpinner, clearLoader } from '../loader.js';
import { getCategories, getAllPodcasts } from '../utilities/requests.js';

const podcastContainer = document.querySelector('.podcasts-veiw-container')
let podcastfeedBackDiv;

const categoriesContainer = document.querySelector('.categories-container')
let categoreisItems = [];

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
            console.log(categoreisItems[i].textContent)
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
        <div class="pic">
            <img src="${podcast.createdBy.photo}" alt="user podcast">
        </div>
        <div class="description p-2">
            <div class="podcast-name text-light fw-bold  fs-5">${podcast.name}</div>
            <p class="p-1 ">By <span class="fw-bold">${podcast.createdBy.name}</span></p>
            <hr>
            <div class="inner-infos">

                <div class="d-flex justify-content-between"> 
                    <div class="d-flex">
                        <img src="../../assets/squareIcon.svg" alt="icon">
                        <p class="category">${podcast.category}</p>
                    </div>
                    <img src="../../assets/cloud-download.svg" alt="download">
                </div>

                <div class="d-flex justify-content-between"> 
                    <div class="d-flex">
                        <img src="../../assets/clock.svg" alt="">
                        <p class="duration">${Math.floor(podcast.audio.duration / 60)} : ${ Math.floor(podcast.audio.duration - Math.floor(podcast.audio.duration / 60) * 60)}</p>
                    </div>
                    <button class="play-podcast-btn">
                        <img src="../../assets/circle-play-solid.svg" alt="play" >
                        Play</button>
                </div> 
            </div>
        </div> 
    </div>
    
    `;

    podcastContainer.insertAdjacentHTML('beforeend', markup)
}




export const podcastFeedback = (message) => {
    const markup =  `
        <div class="feed-back fail">
            <p class="feed-back-text">
               ${message ? message : 'something went wrong'} 
            </p>
            <div class="clear-feed-back">
                <i class='fa-solid fa-x'></i>
            </div>
        </div>
        `
    podcastContainer.insertAdjacentHTML('beforeend', markup)
    podcastfeedBackDiv =  document.querySelector('.feed-back')

    document.querySelector('.clear-feed-back').addEventListener('click', ()=>{
       clearFeedBack(podcastfeedBackDiv)
    })
}

const clearFeedBack  = (element) => {
    if(element) element.parentElement.removeChild(element)
    podcastfeedBackDiv = null
}




getAllPodcasts()