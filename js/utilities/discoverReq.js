import { discoverPodcasts, discoverUsersDisplay, renderSearchUserResult, insertLoadMoreusersBtn ,insertLoadMorePodsBtn} from "../discover/discover.js";
import { podcastFeedback } from "../podcast/feedBack.js";
import { loadSpinner,clearLoader } from '../loader.js';

const token = JSON.parse(localStorage.getItem('user-token'))

export const getAllPodcasts = async(podcastContainer,page) => {
    try {
        loadSpinner(podcastContainer)
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/podcasts?page=${page}&limit=4`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            const {data} = res;
            if(data.length > 0 ){
                clearLoader()
                data.map(d => discoverPodcasts(d))
                insertLoadMorePodsBtn()
            }
            else {
                clearLoader()
                // console.log(res.message)
                podcastFeedback(podcastContainer,'There is no more podcasts to display')
            }
        }
        else{
            clearLoader()
            // console.log(res.message)
            podcastFeedback(podcastContainer,res.message);
        }
    } catch(error) {
        // alert(error.message)
        clearLoader()
        console.log(error.message)
        podcastFeedback(podcastContainer,error.message)
    }
}

export const discoverUsersReq = async(container, page) => {
    try {
        loadSpinner(container)
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/users/discover?page=${page}&limit=10&sort=-followers`, {
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
                data.map(d => discoverUsersDisplay(d))
                insertLoadMoreusersBtn()
            }else {
                
                podcastFeedback(container,'There is more users to display')
            }
        }
        else{
            clearLoader()
            podcastFeedback(container,res.message);
        }
    } catch(error) {
        // alert(error.message)
        clearLoader()
        podcastFeedback(container,error.message)
    }
}


//search for podcasters
export const searchForUsers = async(container,value) => {
    try {
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/users/search?s==${value}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            const {data} = res;
            data.length > 0 ? data.map(d => renderSearchUserResult(d)) : podcastFeedback(container ,`No user with ${value} name`)
        }
        else{
            podcastFeedback(container,res.message);
        }
    } catch(error) {
        // alert(error.message)
        podcastFeedback(container,error.message)
    }
}