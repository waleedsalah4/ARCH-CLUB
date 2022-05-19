import {popupMessage,logout} from './helpers.js';
import {eventView, deletElmenetFromUi,puttingHandlers,updateEventHandling} from './../events/eventCard.js'
import {renderMainInfo,queryParams,insertLoadMoreEventsBtn} from '../profile/controller.js';
import Myevents from '../profile/Myevents.js';
import { loadSpinner, clearLoader} from '../loader.js';
import { podcastFeedback  } from "../podcast/feedBack.js";
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




export const fetchFollowing = async function(container = Follow.followingContainer,page ,paggined=false){
    loadSpinner(document.querySelector('.following-content'));
    try{
        const response = await fetch(`${url}/api/v1/users/me/following?limit=4&page=${page}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            }
    });

    const res = await response.json();
    /* Follow.renderFollowing(res.data); */
    if(res.status !== 'fail'){
        const {data} = res;

        if(data.length > 0 ){
            if(paggined){
                Follow.renderFollowing(data,true);
            }
            else{
                Follow.renderFollowing(data);
            }
            
            Follow.myFollowingPaggination(fetchFollowing);
        }
        else {
            clearLoader()
            if(paggined){
                podcastFeedback(container,'End of results ')
            }
            else{
                podcastFeedback(container,'there is no following')
            }
            
        }  
    }
    else{
        clearLoader()
        podcastFeedback(container,res.message);
    }
    }

    catch(err){
        console.log(err);
    }
}

export const fetchFollowers = async function(container = Follow.followersContainer,page ,paggined=false){
    loadSpinner(document.querySelector('.followers-content'));
    try{
        
        console.log(page);
        const response = await fetch(`${url}/api/v1/users/me/followers?limit=4&page=${page}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            }
    });

    const res = await response.json();
    
    
    if(res.status !== 'fail'){
        const {data} = res;
       
        if(data.length > 0 ){
            if(paggined){
                Follow.renderFollowers(data,true);
            }
            else{
                Follow.renderFollowers(data);
            }
            
            Follow.myFollowersPaggination(fetchFollowers);
        }
        else {
            clearLoader()
            if(paggined){
                podcastFeedback(container,'End of results ')
            }
            else{
                podcastFeedback(container,'there is no followers')
            }
            
        }  
    }
    else{
        clearLoader()
        podcastFeedback(container,res.message);
    }
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


export const getMyEvents = async function(parent,page,paggined=false){
    loadSpinner(parent);
    console.log('getMy Events');
    try{
        console.log(page); 
        const response = await fetch(`${url}/api/v1/events/me?limit=2&page=${page}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            },
    });

        const res = await response.json();
        console.log(res);

        if(res.status !== 'fail'){
            const {data} = res;
            //parent.innerHTML = '';
            if(data.length > 0 ){
                /* data.map(d => eventView(d))
                puttingHandlers();*/
                clearLoader();
                Myevents.renderEvent(data);
                Myevents.insertLoadMoreEventsBtn(getMyEvents); 
            }
            else{
                
                if(paggined){
                    clearLoader();
                    parent.insertAdjacentHTML('beforeend',`
                    <div class="feed-back sucsses">
                        <p class="feed-back-text">End of results!</p>
                        <i class='bx bx-x clear-feed-back'></i>
                    </div>
                    `);
                }
                else{
                    clearLoader();
                    parent.insertAdjacentHTML('beforeend',`
                    <div class="feed-back sucsses">
                        <p class="feed-back-text">You have No Events</p>
                        <i class='bx bx-x clear-feed-back'></i>
                    </div>
                    `);
                }
            }
        }
        
    }

    catch(error){
        console.log(error);
    }



}


export const updateEvent = async function(id,changeData){
    console.log('hi');
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
            console.log("failed");
           /*  getMyEvents(document.querySelector('.events-content')); */
           //document.querySelector('.user-Events').click()
            console.log(res.message)
            
        }
        else{
            
            popupMessage(`Changed successfully!`);
            //document.querySelector('.events-content').innerHTML = '';
            //getMyEvents(document.querySelector('.events-content'));
            console.log("clicked");
            /* Myevents.eventContainer.innerHTML = '';
            document.querySelector('.user-Events').click()  */
           
           //getMyEvents( Myevents.eventContainer);

        }
    }

    catch(err){
        console.log(err.message);
    }

}

export const getEventById = async function(id){
    try{
        
        const response = await fetch(`${url}/api/v1/events/${id}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
                'Content-Type': 'application/json'
            }
    });

        const res = await response.json();
        console.log(res);
        if(res.status !== 'success') {
            //popupMessage(res.message);
        
            console.log(res.message)
            
        }
        else{
            /* updateEventHandling(res,id); */
            Myevents.updateEventHandling(res,id);
        }
    }

    catch(err){
        console.log(err.message);
    }

}


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
            /* deletElmenetFromUi(id) */
            Myevents.deletElmenetFromUi(id)
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

export const fetchPodcasts =  async function(container, page,paggined = false){ 
    
    try{
        loadSpinner(document.querySelector('.tab-content'))
        const response = await fetch(`${url}/api/v1/podcasts/me?limit=4&page=${page}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            }
    });

    const res = await response.json();
    
    if(res.status !== 'fail'){
        const {data} = res;
        if(data.length > 0 ){
            
            document.querySelector('.podcasts .tab-number').textContent =  res.results;
            if(paggined){
                PodcastClass.renderPodcast(res.data,false,res.results,true);
            }
            else{
                PodcastClass.renderPodcast(res.data,false,res.results);
            }
            
            PodcastClass.insertLoadMoreEventsBtn(true,fetchPodcasts)
        }
        else {
            clearLoader()
            if(paggined){
                podcastFeedback(container,'End of results!')
            }
            else{
                podcastFeedback(container,'its Empty here!')
            }
        }
}

else{
    clearLoader()
    podcastFeedback(container,res.message);
}
    }

    catch(err){
        console.log(err);
    }
}

export const getUserPodcasts = async function(id,container ,page,paggined = false){

    try{
       
       loadSpinner(document.querySelector('.tab-content'))
        const response = await fetch(`${url}/api/v1/podcasts?createdBy=${id}&limit=4&page=${page}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            },
    });

    const res = await response.json();
    console.log(res);
    if(res.status !== 'fail'){
        const {data} = res;
       

        if(data.length > 0 ){
           
            document.querySelector('.podcasts .tab-number').textContent =  res.results;
            if(paggined){
                PodcastClass.renderPodcast(data,true,res.results,true);
            }
            else{
                PodcastClass.renderPodcast(data,true,res.results);
            }
           
            PodcastClass.insertLoadMoreEventsBtn(false,getUserPodcasts,id);
        }else {
            clearLoader()
            if(paggined){
                podcastFeedback(container,'End of results!')
            }
            else{
                podcastFeedback(container,'its Empty here!')
            }
        }
    }
    
    else{
        clearLoader()
        podcastFeedback(container,res.message);
    }
}

    catch(error){
        console.log(error);
    }
    
}

export const getUserFollowers = async function(id,container = Follow.followersContainer ,page,paggined = false){
    
    try{
        loadSpinner(document.querySelector('.followers-content'));
        const response = await fetch(`${url}/api/v1/users/${id}/followers?limit=4&page=${page}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            },
    });

    const res = await response.json();
    console.log(res);
    if(res.status !== 'fail'){
        const {data} = res;
      
        if(data.length > 0 ){
            
            if(paggined){
                Follow.renderFollowers(data,true);
            }
            else{
                Follow.renderFollowers(data);
            }
            Follow.followersPaggination(getUserFollowers);
        }
        else {
            clearLoader()
            if(paggined){
                podcastFeedback(container,'End of results!')
            }
            else{
                podcastFeedback(container,'its Empty here!')
            }
            
        }  
    }
    else{
        clearLoader()
        podcastFeedback(container,res.message);
    }
    

}

    catch(error){
        console.log(error);
    }
    
}

export const getUserFollowing = async function(id = queryParams.id,container = Follow.followingContainer ,page,paggined = false){
    
    try{
        loadSpinner(document.querySelector('.following-content'));
        const response = await fetch(`${url}/api/v1/users/${id}/following?limit=4&page=${page}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            },
    });

    const res = await response.json();
    console.log(res);
    if(res.status !== 'fail'){
        const {data} = res;
       
        if(data.length > 0 ){
            if(paggined){
                Follow.renderFollowing(data,true);
            }
            else{
                Follow.renderFollowing(data);
            }
            
            Follow.followingPaggination(getUserFollowing);
        }
        else {
            clearLoader()
            if(paggined){
                podcastFeedback(container,'End of results!')
            }
            else{
                podcastFeedback(container,'its Empty here!')
            }
            
        }  
    }
    else{
        clearLoader()
        podcastFeedback(container,res.message);
    }
}

    catch(error){
        console.log(error);
    }
    
}



export const followUser = async(id, btnValue) => {
    btnValue.textContent = 'following...';
    try {
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/users/${id}/following`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            btnValue.textContent = 'unFollow';
            console.log(btnValue.textContent)
            btnValue.classList = 'follow-following f-btn btn-following-profile';
        }
        else{
            btnValue.textContent = 'unFollow';
            alert(res.message);
            
        }
    } catch(error) {
        // alert(error.message)
        btnValue.textContent = 'Follow';
        alert(error.message)
        
    }
}

export const unFollowUser = async(id, btnValue) => {
    try {
        btnValue.textContent = 'unFollowing...';
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/users/${id}/following`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            btnValue.textContent = 'Follow';
            btnValue.classList = 'follow-following f-btn btn-follow-profile';
        }
        else{
            btnValue.textContent = 'unFollow';
            alert(res.message);
          
        }
    } catch(error) {
        // alert(error.message)
        btnValue.textContent = 'unFollow';
        alert(error.message)
        
    }
}