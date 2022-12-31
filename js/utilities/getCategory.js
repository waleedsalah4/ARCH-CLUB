//need to be handled later
import { url } from '../config.js';

export const getCategories = async() => {
    try{
        const res = await fetch(`${url}/api/v1/categories/`)
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