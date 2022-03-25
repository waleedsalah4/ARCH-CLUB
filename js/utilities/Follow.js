const token = JSON.parse(localStorage.getItem('user-token'))

export const followUser = async(id, btnValue) => {
    btnValue.textContent = 'following...';
    try {
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/users/${id}/following`, {
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
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            btnValue.textContent = 'Follow';
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