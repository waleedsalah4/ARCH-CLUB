import {popupMessage,logout} from './helpers.js';
import {eventView, deletElmenetFromUi} from './../events/eventCard.js'
import {eventpreView,displayPost,renderMainInfo,renderPodcasts,renderFollowing,renderFollowers,sideOtherUser} from '../profile/controller.js';
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
    
    try{
        const response = await fetch(`${url}/api/v1/users/me/following`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            }
    });

    const res = await response.json();
    localStorage.setItem('my-following',JSON.stringify(res.data));
    localStorage.setItem('number-of-my-following',JSON.stringify(res.results))
    //console.log(res);

}
    catch(err){
        console.log(err);
    }
}

export const fetchFollowers = async function(){
    
    try{
        const response = await fetch(`${url}/api/v1/users/me/followers`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            }
    });

    const res = await response.json();
    localStorage.setItem('my-followers',JSON.stringify(res.data));
    localStorage.setItem('number-of-my-followers',JSON.stringify(res.results))
}
    catch(err){
        console.log(err);
    }
}

/*
export const deleteMe = async function(){

    try{
        const response = await fetch(`${url}/api/v1/users/deleteMe`,{
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            }
    }
    );

    const res = await response.json();
    localStorage.setItem('my-followers',JSON.stringify(res.data));
    localStorage.setItem('number-of-my-followers',JSON.stringify(res.results))
}
    catch(err){
        console.log(err);
    }
}
*/
/*
export const updatePassword = async function(updatePassBody){
    try{
        const response = await fetch(`${url}/api/v1/users/updateMyPassword`,{
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(updatePassBody)
    }
    );
    
    const res = await response.json();
    if(res.status != 'fail') {
        localStorage.setItem('user-data', JSON.stringify(res.data.user));
        localStorage.setItem('user-token', JSON.stringify(res.token));
        popupMessage(`Your Password has been changed successfully!, please login again`);
        setTimeout(logout,5000);
        
    }
    else{
        if(res.message === 'User recently changed the password! Please log in again.'){
            popupMessage(`U just changed Your Password, please login again.`)
            setTimeout(logout,5000);
        }
        popupMessage(res.message);
    }
    
    
}

    catch(err){
        console.log(err.message);  
    }
}


export const updateMe = async function(changeData){
    try{
        console.log(changeData)
        const response = await fetch(`${url}/api/v1/users/updateMe`,{
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
            localStorage.setItem('user-data', JSON.stringify(user));
            popupMessage(`Changed successfully!`);
        }
    }

    catch(err){
        console.log(err.message);
    }
}
*/


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
           
            if(data.length > 0 ){
                data.map(d => eventView(d,parent))
                
            }
            else{
                parent.insertAdjacentHTML('beforeend',`<p class="emptyMessage">
                its empty here..
             </p>`);
            }
        }
        
    }

    catch(error){
        console.log(error);
    }



}

export const getEventById = async function(id){
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
        displayPost(data);
        
    }     
}

    catch(error){
        console.log(error);
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
        sideOtherUser(data.name);
        renderMainInfo(data,true);
        
    }     
}

    catch(error){
        console.log(error);
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
        
        renderPodcasts(data,true,res.results);
        
        
        
    }     
}

    catch(error){
        console.log(error);
    }
    
}

export const getUserFollowers = async function(id){

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
            renderFollowers(data,true);
        }
        
        
    }     
}

    catch(error){
        console.log(error);
    }
    
}

export const getUserFollowing = async function(id){

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
            renderFollowing(data,true);
        }
        
        
    }     
}

    catch(error){
        console.log(error);
    }
    
}

