let podcastfeedBackDiv;
export const podcastFeedback = (container, message ,count) => {
    let markup;
    if(count === 0){
        markup =  `
        <div class="feed-back fail">
            <div>
                <p class="feed-back-text">
                ${message ? message : 'something went wrong'} 
                </p>
                <a href="../discover/discover.html">Start discover</a>
            </div>
            <div class="clear-feed-back">
                <i class='fa-solid fa-x'></i>
            </div>
        </div>
        `
    } else {
        markup =  `
        <div class="feed-back fail">
            <p class="feed-back-text">
               ${message ? message : 'something went wrong'} 
            </p>
            <div class="clear-feed-back">
                <i class='fa-solid fa-x'></i>
            </div>
        </div>
        `
    }
    container.insertAdjacentHTML('beforeend', markup)
    podcastfeedBackDiv =  document.querySelector('.feed-back')

    document.querySelector('.clear-feed-back').addEventListener('click', ()=>{
       clearFeedBack(podcastfeedBackDiv)
    })
}

const clearFeedBack  = (element) => {
    if(element) element.parentElement.removeChild(element)
    podcastfeedBackDiv = null
}
