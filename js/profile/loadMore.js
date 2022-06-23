import { 
    getMyPodcasts,
    getOtherUserPodcasts,
    getMyFollowing,
    getMyFollowers,
    getAnotherUserFollowing,
    getOtherUserFollowers,
    getOtherUserEvents,
    getMyEvents
} from '../utilities/profileRequests.js'

// let podcastsPage = 1
let loadMorePodcasts;

let userPodcastsPage = 1
let userLoadMorePodcasts;
 
export const insertLoadMorePodcastsBtn = (podcastsPage) => {
    const markup =`
    <div class="load-more loadPods">
        <button class="load-more-btn">Load More</button>
    </div>
    `
    document.querySelector('.pod-components').insertAdjacentHTML('beforeend', markup)

    loadMorePodcasts = document.querySelector('.loadPods')
    loadMorePodcasts.addEventListener('click', () => {
        podcastsPage++
        clearLoadMore(loadMorePodcasts)
        getMyPodcasts(document.querySelector('.pod-components'), podcastsPage, document.querySelector('#snackbar-container'))
    })
}


export const insertLoadMorePodcastsBtnForOtherUser = (id) => {
    const markup =`
    <div class="load-more userLoadPods">
        <button class="load-more-btn">Load More</button>
    </div>
    `
    document.querySelector('.pod-components').insertAdjacentHTML('beforeend', markup)

    userLoadMorePodcasts = document.querySelector('.userLoadPods')
    userLoadMorePodcasts.addEventListener('click', () => {
        userPodcastsPage++
        clearLoadMore(userLoadMorePodcasts)
        getOtherUserPodcasts(id,document.querySelector('.pod-components'), userPodcastsPage, document.querySelector('#snackbar-container'))
    })
}


let myfollowingLoadMore;
export const insertLoadMoreMyFollowing = (page) => {
    const markup =`
    <div class="load-more myfollowing">
        <button class="load-more-btn">Load More</button>
    </div>
    `
    document.querySelector('.following-components').insertAdjacentHTML('beforeend', markup)

    myfollowingLoadMore = document.querySelector('.myfollowing')
    myfollowingLoadMore.addEventListener('click', () => {
        page++
        clearLoadMore(myfollowingLoadMore)
        getMyFollowing(document.querySelector('.following-components'), page, document.querySelector('#snackbar-container'))
    })
}

let myfollowersLoadMore;
export const insertLoadMoreMyFollowers = (page) => {
    const markup =`
    <div class="load-more myfollowers">
        <button class="load-more-btn">Load More</button>
    </div>
    `
    document.querySelector('.followers-components').insertAdjacentHTML('beforeend', markup)

    myfollowersLoadMore = document.querySelector('.myfollowers')
    myfollowersLoadMore.addEventListener('click', () => {
        page++
        clearLoadMore(myfollowersLoadMore)
        getMyFollowers(document.querySelector('.followers-components'), page, document.querySelector('#snackbar-container'))
    })
}

// other user follow
let otherUserfollowingLoadMore;
export const insertLoadMoreOtherFollowing = (id,page) => {
    const markup =`
    <div class="load-more myfollowing">
        <button class="load-more-btn">Load More</button>
    </div>
    `
    document.querySelector('.following-components').insertAdjacentHTML('beforeend', markup)

    otherUserfollowingLoadMore = document.querySelector('.myfollowing')
    otherUserfollowingLoadMore.addEventListener('click', () => {
        page++
        clearLoadMore(otherUserfollowingLoadMore)
        getAnotherUserFollowing(id,document.querySelector('.following-components'), page, document.querySelector('#snackbar-container'))
    })
}


let otherUserfollowersLoadMore;
export const insertLoadMoreOtherFollowers = (id,page) => {
    const markup =`
    <div class="load-more myfollowers">
        <button class="load-more-btn">Load More</button>
    </div>
    `
    document.querySelector('.followers-components').insertAdjacentHTML('beforeend', markup)

    otherUserfollowersLoadMore = document.querySelector('.myfollowers')
    otherUserfollowersLoadMore.addEventListener('click', () => {
        page++
        clearLoadMore(otherUserfollowersLoadMore)
        getOtherUserFollowers(id,document.querySelector('.followers-components'), page, document.querySelector('#snackbar-container'))
    })
}


let myEventsLoadMore;
export const insertLoadMoreMyEvents = (page) => {
    const markup =`
    <div class="load-more myEvents">
        <button class="load-more-btn">Load More</button>
    </div>
    `
    document.querySelector('.events-components').insertAdjacentHTML('beforeend', markup)

    myEventsLoadMore = document.querySelector('.myEvents')
    myEventsLoadMore.addEventListener('click', () => {
        page++
        clearLoadMore(myEventsLoadMore)
        getMyEvents(document.querySelector('.events-components'), page, document.querySelector('#snackbar-container'))
    })
}


let otherUserEventsLoadMore;
export const insertLoadMoreOtherEvents = (id,page) => {
    const markup =`
    <div class="load-more userEvents">
        <button class="load-more-btn">Load More</button>
    </div>
    `
    document.querySelector('.events-components').insertAdjacentHTML('beforeend', markup)

    otherUserEventsLoadMore = document.querySelector('.userEvents')
    otherUserEventsLoadMore.addEventListener('click', () => {
        page++
        clearLoadMore(otherUserEventsLoadMore)
        getOtherUserEvents(id,document.querySelector('.events-components'), page, document.querySelector('#snackbar-container'))
    })
}

const clearLoadMore  = (element) => {
    if(element) {
        element.parentElement.removeChild(element)
    }
    element = null;
}



export const numberOfPodcasts = (num) => {
    document.querySelector('.number-of-podcasts').innerHTML = num
}

export const numberOfFollowing = (num) => {
    document.querySelector('.number-of-following').innerHTML = num
}
export const numberOfFollowers = (num) => {
    document.querySelector('.number-of-followers').innerHTML = num
}
export const numberOfEvents = (num) => {
    document.querySelector('.number-of-events').innerHTML = num
}
// export const updateNumberOfPodcasts = () => {
//     // document.querySelector('.number-of-podcasts').innerHTML = num
//     let newNum = parseFloat(document.querySelector('.number-of-podcasts').textContent) + 1
//     document.querySelector('.number-of-podcasts').textContent = newNum;
// }