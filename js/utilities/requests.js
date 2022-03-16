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