import {popupMessage,logout} from './helpers.js';

export const url = 'https://audiocomms-podcast-platform.herokuapp.com';
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

export const uploadPhoto = async function(photo){
    try{

        const response = await fetch(`${url}/api/v1/users/updateMyPhoto`,{
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            },
            body: photo
    });

        const res = await response.json();
        if(res.status != 'fail'){
            popupMessage(`changed successfully!`);
        }
    }

    catch(err){
        console.log(err);
    }
}

