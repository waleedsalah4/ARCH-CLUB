import { loadSpinner, clearLoader } from "../loader.js";
import { snackbar } from '../utilities/snackbar.js';
import { popupMessage } from './helpers.js';
import { podcastCard, deletePodcatsFromUI } from '../profile/podcastCard.js';
import { renderFollow, renderFollowers } from "../profile/renderFollow.js";
import { Events, deleteEventFromUI } from "../profile/Myevents.js";
import { 
    insertLoadMorePodcastsBtn, 
    insertLoadMorePodcastsBtnForOtherUser,
    insertLoadMoreMyFollowing ,
    insertLoadMoreMyFollowers,
    insertLoadMoreOtherFollowing,
    insertLoadMoreOtherFollowers,
    insertLoadMoreOtherEvents,
    insertLoadMoreMyEvents,

    numberOfPodcasts,
    numberOfFollowers,
    numberOfFollowing,
    numberOfEvents
} from '../profile/loadMore.js';



const url = 'https://audiocomms-podcast-platform.herokuapp.com';

const token = JSON.parse(localStorage.getItem('user-token'))


export const getMyPodcasts = async(podcastContainer ,page, snakeBarContainer) => {
    try {
        loadSpinner(podcastContainer)
        const response = await fetch(`${url}/api/v1/podcasts/me?limit=4&page=${page}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            const {docsCount,data} = res;
            clearLoader()
            
            if(data.length > 0 ){
                page === 1 ? numberOfPodcasts(docsCount) : ''
                data.map(d => podcastCard(d,podcastContainer,false))
                insertLoadMorePodcastsBtn(page)
            }else if(data.length > 0 || page >= 1) {
                snackbar(snakeBarContainer,'info', `<b>info: </b>you have no more podcasts `, 5000);
            } else{
                snackbar(snakeBarContainer,'info', `<b>info: </b>you have no podcasts `, 5000);
            }
             
        }
        else{
            clearLoader()
            snackbar(snakeBarContainer,'error', `<b>Error: </b> ${res.message} `, 5000);
        }
    } catch(error) {
        clearLoader()
        snackbar(snakeBarContainer,'error', `<b>Error: </b> ${error.message} `, 5000);
        console.log(error.message)
    }
}

export const deletePodcast = async function(id){
    try{

        const response = await fetch(`${url}/api/v1/podcasts/${id}`,{
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        // console.log(res);
        if(res.status !== 'success') {
            popupMessage(res.message);
            // console.log(res.message)
        } else{
            popupMessage(`the podcast has been deleted successfully!`);
            deletePodcatsFromUI(id)
        }
    }

    catch(error){
        popupMessage(res.message);
    }
}


export const getOtherUserPodcasts = async(id,podcastContainer ,page, snakeBarContainer) => {
    try {
        loadSpinner(podcastContainer)
        const response = await fetch(`${url}/api/v1/podcasts?createdBy=${id}&limit=4&page=${page}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            const {docsCount,data} = res;
            // console.log(data)
            clearLoader()
            
            if(data.length > 0 ){
                page === 1 ? numberOfPodcasts(docsCount) : ''
                data.map(d => podcastCard(d,podcastContainer , true))
                // console.log('what is the fuck happen')
                insertLoadMorePodcastsBtnForOtherUser(id)
            }else if(data.length > 0 && page >= 1) {
                snackbar(snakeBarContainer,'info', `<b>info: </b>user has no more podcasts `, 5000);
            } else{
                snackbar(snakeBarContainer,'info', `<b>info: </b>user has no podcasts `, 5000);
            }
             
        }
        else{
            clearLoader()
            // console.log(res.message)
            snackbar(snakeBarContainer,'error', `<b>Error: </b> ${res.message} `, 5000);
        }
    } catch(error) {
        clearLoader()
        console.log(error.message)
        snackbar(snakeBarContainer,'error', `<b>Error: </b> ${error.message} `, 5000);
    }
}


export const generateSignature = async function(){

    try { 
    const response = await fetch(`${url}/api/v1/podcasts/generateSignature`,{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
        }
    });
    
    const res = await response.json();
    
    if(res.status !== 'fail'){
        
        const signature = res;

        localStorage.setItem('user-signature', JSON.stringify(signature));
    
    }
}
    catch(er){
        console.log(er);
    }

}

/********* */
export const createPodcast = async function(podcastData,podName,podCategory, uiObjData){

    try{
        
        const podcastBody = {
            "name": podName,
            "category": podCategory,
            "audio": {
                "public_id": podcastData.public_id,
            }
        }
        // console.log(podcastBody);

        const response = await fetch(`${url}/api/v1/podcasts`,{
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
                'content-type': 'application/json'
            },
            body : JSON.stringify(podcastBody)
        });

    

        const res = await response.json();
        if(res.status !== 'fail'){

            snackbar(uiObjData.snakeBarContainer,'info', `<b>Info: </b> Your Podcast Has Been Loaded Successfully! `, 5000);
            uiObjData.podConatiner.innerHTML = '';
            getMyPodcasts(uiObjData.podConatiner,1,uiObjData.snakeBarContainer)
        }
        else{
            // podcastFeedback(document.querySelector('.mgs-output'),`${res.message}`)
            snackbar(uiObjData.snakeBarContainer,'error', `<b>Error: </b> ${res.message} `, 5000);
            //popupMessage(`${res.message}`);
        }
    } catch(error){
        snackbar(uiObjData.snakeBarContainer,'error', `<b>Error: </b> ${res.message} `, 5000);
        
        // console.log(error);
    }

}


export const uploadPodcast = async function(file,podName,podCategory, uiObjData){
    try{
        //1)generating signature
        await generateSignature();
        const signature = JSON.parse(localStorage.getItem('user-signature'));

        let form = new FormData();
        form.append('file',file.files[0]);
        form.append('folder',"podcasts");
        form.append("resource_type", "audio");

        //2)upload to cloudinary
        const response = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/video/upload?api_key=${signature.apiKey}&timestamp=${signature.timestamp}&signature=${signature.signature}`,
        {
            method: 'POST',
            body: form,
        }
            );

        const res = await response.json();
        //3) create podcast
        console.log(res);
        await createPodcast(res,podName,podCategory, uiObjData)
    }

    catch(error){
        popupMessage(`${error.message}`);
        console.log(error);
    }
}

//----------------- end podcasts ----------------

//-----------------start following-----------------
export const getMyFollowing = async (container,page ,snakeBarContainer) =>{
    try{
        loadSpinner(container);
        const response = await fetch(`${url}/api/v1/users/me/following?limit=4&page=${page}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        const res = await response.json();
        if(res.status !== 'fail'){
            const {docsCount,data} = res;

            clearLoader()
            if(data.length > 0 ){
                // console.log(data)
                page === 1 ? numberOfFollowing(docsCount) : ''
                data.map(d => renderFollow(d,container))
                insertLoadMoreMyFollowing(page)
            }else if(data.length > 0 || page >= 1) {
                snackbar(snakeBarContainer,'info', `<b>info: </b>you have no more following `, 5000);
            } else{
                snackbar(snakeBarContainer,'info', `<b>info: </b>you have no following `, 5000);
            }  
        }
        else{
            clearLoader()
            snackbar(snakeBarContainer,'error', `<b>Error: </b>${res.message}`, 5000);
        }
    }

    catch(err){
        snackbar(snakeBarContainer,'error', `<b>Error: </b>${err.message}`, 5000);
    }
}

export const getMyFollowers = async (container,page ,snakeBarContainer) =>{
    try{
        loadSpinner(container);
        const response = await fetch(`${url}/api/v1/users/me/followers?limit=4&page=${page}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        const res = await response.json();
        if(res.status !== 'fail'){
            const {docsCount,data} = res;

            clearLoader()
            if(data.length > 0 ){
                // console.log(data)
                page === 1 ? numberOfFollowers(docsCount) : ''
                data.map(d => renderFollowers(d,container))
                insertLoadMoreMyFollowers(page)
            }else if(data.length > 0 || page >= 1) {
                snackbar(snakeBarContainer,'info', `<b>info: </b>you have no more followers `, 5000);
            } else{
                snackbar(snakeBarContainer,'info', `<b>info: </b>you have no followers `, 5000);
            }  
        }
        else{
            clearLoader()
            snackbar(snakeBarContainer,'error', `<b>Error: </b>${res.message}`, 5000);
        }
    }

    catch(err){
        snackbar(snakeBarContainer,'error', `<b>Error: </b>${err.message}`, 5000);
    }
}


//get user Following

export const getAnotherUserFollowing = async (id,container,page ,snakeBarContainer) =>{
    try{
        loadSpinner(container);
        const response = await fetch(`${url}/api/v1/users/${id}/following?limit=4&page=${page}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        const res = await response.json();
        if(res.status !== 'fail'){
            const {docsCount,data} = res;

            clearLoader()
            if(data.length > 0 ){
                // console.log(data)
                page === 1 ? numberOfFollowing(docsCount) : ''
                data.map(d => renderFollow(d,container))
                insertLoadMoreOtherFollowing(id,page)
            }else if(data.length > 0 || page >= 1) {
                snackbar(snakeBarContainer,'info', `<b>info: </b>user has no more following `, 5000);
            } else{
                snackbar(snakeBarContainer,'info', `<b>info: </b>user has no following `, 5000);
            }  
        }
        else{
            clearLoader()
            snackbar(snakeBarContainer,'error', `<b>Error: </b>${res.message}`, 5000);
        }
    }

    catch(err){
        snackbar(snakeBarContainer,'error', `<b>Error: </b>${err.message}`, 5000);
    }
}


export const getOtherUserFollowers = async (id,container,page ,snakeBarContainer) =>{
    try{
        loadSpinner(container);
        const response = await fetch(`${url}/api/v1/users/${id}/followers?limit=4&page=${page}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        const res = await response.json();
        if(res.status !== 'fail'){
            const {docsCount,data} = res;

            clearLoader()
            if(data.length > 0 ){
                // console.log(data)
                page === 1 ? numberOfFollowers(docsCount) : ''
                data.map(d => renderFollowers(d,container))
                insertLoadMoreOtherFollowers(id,page)
            }else if(data.length > 0 || page >= 1) {
                snackbar(snakeBarContainer,'info', `<b>info: </b>user has no more followers `, 5000);
            } else{
                snackbar(snakeBarContainer,'info', `<b>info: </b>user has no followers `, 5000);
            }  
        }
        else{
            clearLoader()
            snackbar(snakeBarContainer,'error', `<b>Error: </b>${res.message}`, 5000);
        }
    }

    catch(err){
        snackbar(snakeBarContainer,'error', `<b>Error: </b>${err.message}`, 5000);
    }
}


export const getMyEvents = async (container,page ,snakeBarContainer) =>{
    try{
        loadSpinner(container);
        const response = await fetch(`${url}/api/v1/events/me/?limit=4&page=${page}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        const res = await response.json();
        if(res.status !== 'fail'){
            const {docsCount,data} = res;

            clearLoader()
            if(data.length > 0 ){
                // console.log(data)
                page === 1 ? numberOfEvents(docsCount) : ''
                data.map(d => Events(d,container,false))
                insertLoadMoreMyEvents(page)
            }else if(data.length > 0 || page >= 1) {
                snackbar(snakeBarContainer,'info', `<b>info: </b>you have no more Events `, 5000);
            } else{
                snackbar(snakeBarContainer,'info', `<b>info: </b>you have no Events `, 5000);
            }  
        }
        else{
            clearLoader()
            snackbar(snakeBarContainer,'error', `<b>Error: </b>${res.message}`, 5000);
        }
    }

    catch(err){
        snackbar(snakeBarContainer,'error', `<b>Error: </b>${err.message}`, 5000);
    }
}

export const getOtherUserEvents = async (id,container,page ,snakeBarContainer) =>{
    try{
        loadSpinner(container);
        const response = await fetch(`${url}/api/v1/events/?createdBy=${id}&limit=4&page=${page}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        const res = await response.json();
        if(res.status !== 'fail'){
            const {docsCount,data} = res;

            clearLoader()
            if(data.length > 0 ){
                // console.log(data)
                page === 1 ? numberOfEvents(docsCount) : ''
                data.map(d => Events(d,container,true))
                insertLoadMoreOtherEvents(id,page)
            }else if(data.length > 0 && page >= 1) {
                snackbar(snakeBarContainer,'info', `<b>info: </b>user has no more Events `, 5000);
            } else{
                snackbar(snakeBarContainer,'info', `<b>info: </b>user has no Events `, 5000);
            }  
        }
        else{
            clearLoader()
            snackbar(snakeBarContainer,'error', `<b>Error: </b>${res.message}`, 5000);
        }
    }

    catch(err){
        snackbar(snakeBarContainer,'error', `<b>Error: </b>${err.message}`, 5000);
    }
}


export const updateEventById = async (id,data,snakeBarContainer,eventsContainer) =>{
    try{
        console.log('data before submition',data)
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/events/${id}`,{
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        const res = await response.json();
        if(res.status !== 'fail') {
            popupMessage(`the event has been updated successfully!`);
            //refetch events
            eventsContainer.innerHTML = '';
            getMyEvents(eventsContainer,1,snakeBarContainer)
            // console.log(res)
        }
        else{
            snackbar(snakeBarContainer,'error', `<b>Error: </b>${res.message}`, 5000);
        }

    }

    catch(error){
        snackbar(snakeBarContainer,'error', `<b>Error: </b>${error.message}`, 5000);
    }
}

export const deleteEventById = async (id,snakeBarContainer) =>{
    try{

        const response = await fetch(`${url}/api/v1/events/${id}`,{
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const res = await response.json();
        if(res.status !== 'fail') {
            popupMessage(`the event has been deleted successfully!`);
            deleteEventFromUI(id) 
        }
        else{
            snackbar(snakeBarContainer,'error', `<b>Error: </b>${res.message}`, 5000);
        }

    }

    catch(error){
        snackbar(snakeBarContainer,'error', `<b>Error: </b>${error.message}`, 5000);
    }
}