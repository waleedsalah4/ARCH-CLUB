import { snackbar } from './snackbar.js';

const token = JSON.parse(localStorage.getItem('user-token'))

export const likePodcast = async(id, Likesdiv, likesNums,snakeBarContainer) => {
    try{
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/podcasts/likes/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){

            let newLikesNums = parseFloat(likesNums.textContent) + 1
            likesNums.textContent = newLikesNums;
            Likesdiv.classList.add('isLiked')

        }
        else{
            console.log(res.message)
            snackbar(snakeBarContainer,'error', `<b>Error: </b> Somthing went wrong, please try again `, 5000);
        }
    } catch(error) {
        console.log(error.message)
        snackbar(snakeBarContainer,'error', `<b>Error: </b> Somthing went wrong, please try again `, 5000);
    }
}

export const disLikePodcast = async(id, Likesdiv, likesNums,snakeBarContainer) => {
    try{
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/podcasts/likes/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){

            let newLikesNums = parseFloat(likesNums.textContent) - 1
            likesNums.textContent = newLikesNums;
            Likesdiv.classList.remove('isLiked')
        }
        else{
            console.log(res.message)
            snackbar(snakeBarContainer,'error', `<b>Error: </b> Somthing went wrong, please try again `, 5000);
        }
    }  catch(error) {
        console.log(error.message)
        snackbar(snakeBarContainer,'error', `<b>Error: </b> Somthing went wrong, please try again `, 5000);
    }
}