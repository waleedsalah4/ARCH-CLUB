import {popupMessage,logout} from './helpers.js';
import {eventView, deletElmenetFromUi} from './../events/eventCard.js'
import {renderMainInfo} from '../profile/controller.js';
import { loadSpinner, clearLoader} from '../loader.js';
import PodcastClass from '../profile/PodcastClass.js';
import Follow from '../profile/Follow.js';

export const url = 'https://audiocomms-podcast-platform.herokuapp.com';

/** profile */



export const getMe = async function(){

    try{

        const response = await fetch(`${url}/api/v1/users/me`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            }
        });

        const res = await response.json(); 
        const {data} = res;
        localStorage.setItem('user-data', JSON.stringify(data.data));
    }
    catch(err){
        console.log(err);
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
export const createPodcast = async function(podcastData,podName,podCategory){

    try{
        
        const podcastBody = {
            "name": podName,
            "category": podCategory,
            "audio": {
                "public_id": podcastData.public_id,
            }
    }
    console.log(podcastBody);

        const response = await fetch(`${url}/api/v1/podcasts`,{
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
                'content-type': 'application/json'
            },
            body : JSON.stringify(podcastBody)
    }
    );

    

    const res = await response.json();
    if(res.status != 'fail'){
        popupMessage('Your Podcast Has Been Loaded Successfully!');
    }
    else{
        popupMessage(`${res.message}`);
    }
    
    console.log(res);

}
    catch(error){
        
        
        console.log(error);
    }


}


export const uploadPodcast = async function(file,podName,podCategory){
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
        await createPodcast(res,podName,podCategory)
    }

    catch(error){
        popupMessage(`${error.message}`);
        console.log(error);
    }
}



export const fetchFollowing = async function(){
    loadSpinner(document.querySelector('.following-content'));
    try{
        const response = await fetch(`${url}/api/v1/users/me/following`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            }
    });

    const res = await response.json();
    Follow.renderFollowing(res.data);
    /* localStorage.setItem('my-following',JSON.stringify(res.data));
    localStorage.setItem('number-of-my-following',JSON.stringify(res.results)) */
    //console.log(res);

}
    catch(err){
        console.log(err);
    }
}

export const fetchFollowers = async function(){
    loadSpinner(document.querySelector('.followers-content'));
    try{
        const response = await fetch(`${url}/api/v1/users/me/followers`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            }
    });

    const res = await response.json();
    Follow.renderFollowers(res.data);
    /* localStorage.setItem('my-followers',JSON.stringify(res.data));
    localStorage.setItem('number-of-my-followers',JSON.stringify(res.results)) */
}
    catch(err){
        console.log(err);
    }
}



export const deletePodcast = async function(id){
    try{

        const response = await fetch(`${url}/api/v1/podcasts/${id}`,{
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            },
    });

        const res = await response.json();
        console.log(res);
        if(res.status !== 'success') {
            popupMessage(res.message);
            console.log(res.message)
            
        }

        else{
            popupMessage(`the podcast has been deleted successfully!`);
        }
    

    }

    catch(error){
        console.log(error);
    }
}


export const getOtherUser = async function(id){

    try{

        const response = await fetch(`${url}/api/v1/users/${id}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            },
    });

        const res = await response.json();
        console.log(res);
        
    }

    catch(error){
        console.log(error);
    }

}


export const getMyEvents = async function(parent){
    loadSpinner(parent);
    
    try{

        const response = await fetch(`${url}/api/v1/events/me`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            },
    });

        const res = await response.json();
        console.log(res);

        if(res.status !== 'fail'){
            const {data} = res;
            parent.innerHTML = '';
            if(data.length > 0 ){
                data.map(d => eventView(d))
                
            }
            else{
                parent.innerHTML = '';
                parent.insertAdjacentHTML('beforeend',`
                <div class="feed-back sucsses">
                    <p class="feed-back-text">You have No Events</p>
                    <i class='bx bx-x clear-feed-back'></i>
                </div>
                `);
            }
        }
        
    }

    catch(error){
        console.log(error);
    }



}

/* export const getEventById = async function(id){
    try{

        const response = await fetch(`${url}/api/v1/events/${id}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            },
    });

    const res = await response.json();
    console.log(res);
    if(res.status !== 'fail'){
        const {data} = res;
        //displayPost(data);
        
    }     
}

    catch(error){
        console.log(error);
    }
}
 */

export const deleteEventById = async function(id){
    try{

        const response = await fetch(`${url}/api/v1/events/${id}`,{
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            },
    });

        const res = await response.json();
        // console.log(res);
        if(res.status !== 'success') {
            popupMessage(res.message);
            console.log(res.message)
            
        }

        else{
            // console.log('deleted successfully')
            deletElmenetFromUi(id)
            popupMessage(`the event has been deleted successfully!`);
        }

    }

    catch(error){
        console.log(error);
    }
}

export const getUser = async function(id){

    try{

        const response = await fetch(`${url}/api/v1/users/${id}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            },
    });

    const res = await response.json();
    console.log(res);
    if(res.status !== 'fail'){
        const {data} = res;
        renderMainInfo(data,true);
        
    }     
}

    catch(error){
        console.log(error);
    }
    
}

export const fetchPodcasts =  async function(){ 
    
    try{
        const response = await fetch(`${url}/api/v1/podcasts/me`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            }
    });

    const res = await response.json();
    document.querySelector('.podcasts .tab-number').textContent =  res.results;
    PodcastClass.renderPodcast(res.data,false,res.results);
}
    catch(err){
        console.log(err);
    }
}

export const getUserPodcasts = async function(id){

    try{

        const response = await fetch(`${url}/api/v1/podcasts?createdBy=${id}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            },
    });

    const res = await response.json();
    console.log(res);
    if(res.status !== 'fail'){
        const {data} = res;
        
        //renderPodcasts(data,true,res.results);
        document.querySelector('.podcasts .tab-number').textContent =  res.results;
        PodcastClass.renderPodcast(data,true,res.results);
        
        
    }     
}

    catch(error){
        console.log(error);
    }
    
}

export const getUserFollowers = async function(id){
    loadSpinner(document.querySelector('.followers-content'));
    try{

        const response = await fetch(`${url}/api/v1/users/${id}/followers`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            },
    });

    const res = await response.json();
    console.log(res);
    if(res.status !== 'fail'){
        const {data} = res;
        if(data.results !=0){
            //renderFollowers(data,true);
            Follow.renderFollowers(data);
        }
        
        
    }     
}

    catch(error){
        console.log(error);
    }
    
}

export const getUserFollowing = async function(id){
    loadSpinner(document.querySelector('.following-content'));
    try{

        const response = await fetch(`${url}/api/v1/users/${id}/following`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            },
    });

    const res = await response.json();
    console.log(res);
    if(res.status !== 'fail'){
        const {data} = res;
        if(data.results !=0){
            //renderFollowing(data,true);
            Follow.renderFollowing(data);
        }
        
        
    }     
}

    catch(error){
        console.log(error);
    }
    
}

export const updateEvent = async function(id,changeData){

    try{
        
        const response = await fetch(`${url}/api/v1/events/${id}`,{
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(changeData)
    });

        const res = await response.json();
        //console.log(res);
         const user = res.user;
         

        if(res.status !== 'success') {
            popupMessage(res.message);
            console.log(res.message)
            
        }
        else{
            
            popupMessage(`Changed successfully!`);
            getMyEvents(document.querySelector('.events-content'));

        }
    }

    catch(err){
        console.log(err.message);
    }

}

