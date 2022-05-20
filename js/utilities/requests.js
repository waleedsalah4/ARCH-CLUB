import {displayPodcasts, insertLoadMoreBtn, insertLoadMoreBtnForCategories} from '../podcast/podcasts.js';
import { loadSpinner,clearLoader } from '../loader.js';
import { podcastFeedback } from '../podcast/feedBack.js';




const token = JSON.parse(localStorage.getItem('user-token'))
let podcastsArr = []
let podcatsbyCategoryArr = []


export const getAllMyFollowingPodcasts = async(podcastContainer ,page, feedBackContainer) => {
    try {
        loadSpinner(podcastContainer)
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/podcasts/following/me?limit=4&page=${page}`, {
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
                // podcastContainer.innerHTML = ''
                // podcastsArr = [...podcastsArr,...data]
                // console.log('podcastsArr =>', podcastsArr)
                data.map(d => displayPodcasts(d))
                // podcastsArr.map(d => displayPodcasts(d))
                insertLoadMoreBtn()
            }else {
                podcastFeedback(feedBackContainer,'your followings have no more podcasts yet',0)
            }
            
            
        }
        else{
            clearLoader()
            podcastFeedback(feedBackContainer,res.message);
        }
    } catch(error) {
        clearLoader()
        podcastFeedback(feedBackContainer,error.message)
    }
}



export const getMyFollowingPodcastsByCategoryName = async(podcastContainer,category,page, feedBackContainer) => {
    try {
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/podcasts/following/me?category=${category}&limit=4&page=${page}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            const {data} = res;
            if(data.length > 0){
                data.map(d => displayPodcasts(d))
                insertLoadMoreBtnForCategories(category)
            }else {
                podcastFeedback(feedBackContainer ,'There is no more podcasts for this category yet',0)
            }   
        }
        else{
            podcastFeedback(feedBackContainer,res.message);
        }
    } catch(error) {
        podcastFeedback(feedBackContainer,error.message)
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
        podcastFeedback(podcastContainer,error.message)
    }
}



