import { url } from "../config.js";
import { 
    eventView, insertLoadMoreEventsBtn,
    clearModalAndForm, successFeedBack
} from "../events/events.js";
import { loadSpinner, clearLoader} from "../loader.js";
import { podcastFeedback  } from "../podcast/feedBack.js";
import {snackbar} from '../utilities/snackbar.js';


const token = JSON.parse(localStorage.getItem('user-token'))

export const getAllMyFollowingEvents = async(container ,page) => {
    try {
        loadSpinner(container)
        const response = await fetch(`${url}/api/v1/events?limit=4&page=${page}&sort=createdAt`, {
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
                data.map(d => eventView(d))
                insertLoadMoreEventsBtn()
            }else {
                podcastFeedback(container,'theres no more comming events')
            }
        }
        else{
            clearLoader()
            podcastFeedback(container,res.message);
        }
    } catch(error) {
        clearLoader()
        podcastFeedback(container,error.message)
    }
}


export const createEventReq = async(data, btn, snackbarContainer) => {
    try {
        console.log(data)
        btn.textContent = 'Creating...'
        const response = await fetch(`${url}/api/v1/events/me`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            btn.textContent = 'Create'
            clearModalAndForm();
            successFeedBack()
        }
        else{
            btn.textContent = 'Create'
            // console.log(res.message)
            // alert(res.message);
            snackbar(snackbarContainer,'error', `<b>Error: </b>  ${res.message}`, 5000);

        }
    } catch(error) {
        btn.textContent = 'Create'
        // console.log(error.message)
        // alert(error.message)
        snackbar(snackbarContainer,'error', `<b>Error: </b>  ${error.message}`, 5000);
    }
}