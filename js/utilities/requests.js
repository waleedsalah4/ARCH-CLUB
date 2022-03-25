import {displayPodcasts} from '../podcast/podcasts.js';
import { loadSpinner,clearLoader } from '../loader.js';
import { podcastFeedback } from '../podcast/feedBack.js';

// export let requesting = true;
// export let podPage = 1;

const token = JSON.parse(localStorage.getItem('user-token'))



export const getAllMyFollowingPodcasts = async(podcastContainer ,page) => {
    try {
        loadSpinner(podcastContainer)
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/podcasts/following/me?limit=3&page=${page}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            const {data} = res;
            clearLoader()
            
            if(data.length > 0 ){
                data.map(d => displayPodcasts(d))
                
            }else {
                // requesting = false;
                // podPage=1;
                podcastFeedback(podcastContainer,'your followings have no podcasts yet',0)
            }
            
            
        }
        else{
            clearLoader()
            podcastFeedback(podcastContainer,res.message);
        }
    } catch(error) {
        // alert(error.message)
        clearLoader()
        podcastFeedback(podcastContainer,error.message)
    }
}



export const getMyFollowingPodcastsByCategoryName = async(podcastContainer,category) => {
    try {
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/podcasts/following/me?category=${category}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            const {data} = res;
            data.length > 0 ? data.map(d => displayPodcasts(d)) : podcastFeedback(podcastContainer ,'There is no podcasts for this category yet',0)
        }
        else{
            podcastFeedback(podcastContainer,res.message);
        }
    } catch(error) {
        // alert(error.message)
        podcastFeedback(podcastContainer,error.message)
    }
}




//search for podcast
export const searchForPodcast = async(podcastContainer,value) => {
    try {
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/podcasts/search?s==${value}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            const {data} = res;
            data.length > 0 ? data.map(d => displayPodcasts(d)) : podcastFeedback(podcastContainer ,`No podcasts with ${value} name`,0)
        }
        else{
            podcastFeedback(podcastContainer,res.message);
        }
    } catch(error) {
        // alert(error.message)
        podcastFeedback(podcastContainer,error.message)
    }
}


