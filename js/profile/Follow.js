import { loadSpinner, clearLoader} from '../loader.js';


class Follow{
    followingContainer = document.querySelector('.following-content');
    followersContainer = document.querySelector('.followers-content');

    emptyMessageMarkup = `
    <div class="feed-back sucsses">
        <p class="feed-back-text">Its Empty Here.</p>
        <i class='bx bx-x clear-feed-back'></i>
    </div>
    `;
    ;

    constructor(){
    }

    renderFollowing = async function(followingData){
        clearLoader();
        this.followingContainer.innerHTML = '';
        
        //following Data
        followingData.length !=0? 
        followingData.forEach(f=>{
            this.followingContainer.insertAdjacentHTML('beforeend', this.Markup(f.following));
        }) :
        this.followingContainer.insertAdjacentHTML('beforeend', this.emptyMessageMarkup);
        
    }

    renderFollowers = async function(followersgData){
        this.followersContainer.innerHTML = '';

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
}

export default new Follow();