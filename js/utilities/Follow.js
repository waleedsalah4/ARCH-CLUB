import { url } from '../config.js';
import {snackbar} from '../utilities/snackbar.js';
const token = JSON.parse(localStorage.getItem('user-token'))

export const followUser = async(id, btnValue, snackbarContainer) => {
    btnValue.textContent = 'following...';
    try {
        const response = await fetch(`${url}/api/v1/users/${id}/following`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            btnValue.textContent = 'unFollow';
            console.log(btnValue.textContent)
        }
        else{
            btnValue.textContent = 'unFollow';
            // alert(res.message);
            snackbar(snackbarContainer,'error', `<b>Error: </b>  ${res.message}`, 5000);
        }
    } catch(error) {
        // alert(error.message)
        btnValue.textContent = 'Follow';
        // alert(error.message)
        snackbar(snackbarContainer,'error', `<b>Error: </b>  ${error.message}`, 5000);
    }
}

export const unFollowUser = async(id, btnValue, snackbarContainer) => {
    try {
        btnValue.textContent = 'unFollowing...';
        const response = await fetch(`${url}/api/v1/users/${id}/following`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            btnValue.textContent = 'Follow';
        }
        else{
            btnValue.textContent = 'unFollow';
            // alert(res.message);
            snackbar(snackbarContainer,'error', `<b>Error: </b>  ${res.message}`, 5000);
        }
    } catch(error) {
        // alert(error.message)
        btnValue.textContent = 'unFollow';
        // alert(error.message)
        snackbar(snackbarContainer,'error', `<b>Error: </b>  ${error.message}`, 5000);
    }
}