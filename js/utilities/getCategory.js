//need to be handled later

export const getCategories = async() => {
    try{
        const res = await fetch('https://audiocomms-podcast-platform.herokuapp.com/api/v1/categories/')
        const response = await res.json();

        if(response.status === 'success'){
            const {data: {data: result}} = response;
           return result
        } else{
           alert(response.message)
        }
    
    } catch(error) {
        alert(error.message)
    }
}