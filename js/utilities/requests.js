export const getCategories = async() => {
        try{
            const res = await fetch('https://audiocomms-podcast-platform.herokuapp.com/api/v1/categories/')
            const response = await res.json();

            if(response.status === 'success'){
                const {data: {data: result}} = response;
               return result
            } else{
                console.log(response.message)
            }
        
        } catch(error) {
            console.log(error.message)
        }
}


export const url = 'https://audiocomms-podcast-platform.herokuapp.com';

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


export const uploadPodcast = async function(){
    try{
        generateSignature();
        const signature = JSON.parse(localStorage.getItem('user-signature'));

        const response = await fetch(`${url}/v1_1/${signature.cloudName}/video/upload?api_key=${signature.apiKey}&timestamp=${signature.timestamp}&signature=${signature.signature}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token'))}`,
            }
        }
            );
        
        console.log(response);
    }

    catch(err){
        console.log(err);
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
