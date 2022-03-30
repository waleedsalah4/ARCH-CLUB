import { eventView } from "../events/events.js";
import { loadSpinner, clearLoader} from "../loader.js";

const token = JSON.parse(localStorage.getItem('user-token'))

export const getAllMyFollowingEvents = async(container ,page) => {
    try {
        loadSpinner(container)
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/events?limit=4&page=${page}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            const {data} = res;
            clearLoader()
            
            if(data.length > 0 ){
                data.map(d => eventView(d))
                // insertLoadMoreBtn()
            }else {
                podcastFeedback(container,'your followings have no more podcasts yet')
            }
        }
        else{
            clearLoader()
            podcastFeedback(container,res.message);
        }
    } catch(error) {
        clearLoader()
        podcastFeedback(container,error.message)
    }
}