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

export const getPodcastsByCategoryName = async(category) => {
    try {
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/podcasts?category=${category}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            const {data} = res;
            data.length > 0 ? data.map(d => displayPodcasts(d)) : podcastFeedback('there is no podcasts for this category yet')
        }
        else{
            podcastFeedback(res.message);
        }
    } catch(error) {
        // alert(error.message)
        podcastFeedback(error.message)
    }
}