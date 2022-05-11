import { loadSpinner, clearLoader} from '../loader.js';
import {queryParams} from './controller.js';

class Follow{
    followingContainer = document.querySelector('.following-content');
    followersContainer = document.querySelector('.followers-content');
    loadmore;
    followingPage = 1;
    followersPage = 1;
    myFollowingPage = 1;
    myFollowersPage = 1;
    emptyMessageMarkup = `
    <div class="feed-back sucsses">
        <p class="feed-back-text">Its Empty Here.</p>
        <i class='bx bx-x clear-feed-back'></i>
    </div>
    `;
    ;

    constructor(){
    }

    renderFollowing = async function(followingData,clear = false){
        clearLoader();
        if(!clear){
            this.followingContainer.innerHTML = '';
        }
        
        
        //following Data
        followingData.length !=0? 
        followingData.forEach(f=>{
            this.followingContainer.insertAdjacentHTML('beforeend', this.Markup(f.following));
        }) :
        this.followingContainer.insertAdjacentHTML('beforeend', this.emptyMessageMarkup);
        
    }

    renderFollowers = async function(followersgData,clear = false){
        clearLoader();
        if(!clear){
            this.followersContainer.innerHTML = '';
        }

        //followers Data
        followersgData.length !=0? 
        followersgData.forEach(f=>{
            this.followersContainer.insertAdjacentHTML('beforeend', this.Markup(f.follower));
        }):
        this.followersContainer.insertAdjacentHTML('beforeend', this.emptyMessageMarkup);
        
    }


    Markup(f){
        return `
        <li class="d-flex justify-content-between">
                                <div class="d-flex"> 
                                    <img src=${f.photo} alt="">
                                    <p> <a class="userLink" href="./index.html?id=${f._id}"> ${f.name}<a/> <br> <span>${f.followers ? f.followers : 0} ${f.followers==1? 'Follower': 'Followers'}</span> </p>
                                </div>
                                 
                            </li>

    `;

    }

    followingPaggination(fnc){
            const markup =`
            <div class="load-more-following">
                <button class="load-more-btn">Load More</button>
            </div>
        `
        this.followingContainer.insertAdjacentHTML('beforeend', markup)

        this.loadmore = document.querySelector('.load-more-following')
        this.loadmore.addEventListener('click', () => {
            
        
        this.followingPage++;
        fnc(queryParams.id,this.followingContainer, this.followingPage,true) 
        this.clearLoadMore(this.loadmore)
        })
    }

    followersPaggination(fnc){
            const markup =`
            <div class="load-more-followers">
                <button class="load-more-btn">Load More</button>
            </div>
        `
        this.followersContainer.insertAdjacentHTML('beforeend', markup)

        this.loadmore = document.querySelector('.load-more-followers')
        this.loadmore.addEventListener('click', () => {
            
        
        this.followersPage++;
        fnc(queryParams.id,this.followersContainer, this.followersPage,true) 
        this.clearLoadMore(this.loadmore)
        })
    }

    myFollowingPaggination(fnc){
        const markup =`
        <div class="load-more-my-following">
            <button class="load-more-btn">Load More</button>
        </div>
    `
    this.followingContainer.insertAdjacentHTML('beforeend', markup)

    this.loadmore = document.querySelector('.load-more-my-following')
    this.loadmore.addEventListener('click', () => {
        
       
    this.myFollowingPage++;
    fnc(this.followingContainer, this.myFollowingPage,true) 
    this.clearLoadMore(this.loadmore)
    })
    }

    myFollowersPaggination(fnc){
        const markup =`
        <div class="load-more-my-followers">
            <button class="load-more-btn">Load More</button>
        </div>
    `
    this.followersContainer.insertAdjacentHTML('beforeend', markup)

    this.loadmore = document.querySelector('.load-more-my-followers')
    this.loadmore.addEventListener('click', () => {
        
       
    this.myFollowersPage++;
    fnc(this.followersContainer, this.myFollowersPage,true) 
    this.clearLoadMore(this.loadmore)
    })
    }

    clearLoadMore  = (element) => {
        if(element) {
            element.parentElement.removeChild(element)
        }
        //categorieLoadMore = null 
        this.loadmore = null;
    }
}

export default new Follow();