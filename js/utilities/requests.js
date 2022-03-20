import {displayPodcasts ,podcastFeedback} from '../podcast/podcasts.js';

const token = JSON.parse(localStorage.getItem('user-token'))

//need to be handled later

export const getCategories = async() => {
        try{
            const res = await fetch('https://audiocomms-podcast-platform.herokuapp.com/api/v1/categories/')
            const response = await res.json();

            if(response.status === 'success'){
                const {data: {data: result}} = response;
               return result
            } else{
               alert(response.message)
            }
        
        } catch(error) {
            alert(error.message)
        }
}

export const getAllMyFollowingPodcasts = async() => {
    try {
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/podcasts/following/me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            const {data} = res;
            data.length > 0 ? data.map(d => displayPodcasts(d)) : podcastFeedback(0,'your followings have no podcasts yet')
        }
        else{
            podcastFeedback(res.message);
        }
    } catch(error) {
        // alert(error.message)
        podcastFeedback(error.message)
    }
}



export const getMyFollowingPodcastsByCategoryName = async(category) => {
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
            data.length > 0 ? data.map(d => displayPodcasts(d)) : podcastFeedback(0 ,'There is no podcasts for this category yet')
        }
        else{
            podcastFeedback(res.message);
        }
    } catch(error) {
        // alert(error.message)
        podcastFeedback(error.message)
    }
}

export const getAllPodcasts = async() => {
    try {
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/podcasts`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            const {data} = res;
            data.map(d => displayPodcasts(d))
        }
        else{
            podcastFeedback(res.message);
        }
    } catch(error) {
        // alert(error.message)
        podcastFeedback(error.message)
    }
}


//search for podcast
export const searchForPodcast = async(value) => {
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
            data.length > 0 ? data.map(d => displayPodcasts(d)) : podcastFeedback(0 ,`No podcasts with ${value} name`)
        }
        else{
            podcastFeedback(res.message);
        }
    } catch(error) {
        // alert(error.message)
        podcastFeedback(error.message)
    }
}