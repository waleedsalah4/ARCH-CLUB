import { loadSpinner, clearLoader } from "../loader.js";
import { ZeroData } from "../utilities/FeedBackMessages.js";
import { roomCard } from "./roomCard.js";
import { insertLoadMoreRoomsBtn, insertLoadMoreBtnForRoomCategories } from "./home.js";

const token = JSON.parse(localStorage.getItem('user-token'))

export const getAllRooms = async (roomContainer, page) => {
    try {
        loadSpinner(roomContainer)
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/rooms?limit=4&page=${page}`, {
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
                data.map(d => roomCard(d, roomContainer))
                insertLoadMoreRoomsBtn()
            }else {
                // podcastFeedback(podcastContainer,'your followings have no more podcasts yet',0)
                // console.log('zero data')
                page > 1 ? ZeroData(roomContainer,'There is no more active rooms now') : ZeroData(roomContainer,'There is no active rooms now')
            }
            
            
        }
        else{
            clearLoader()
            ZeroData(roomContainer,res.message)
        }
    } catch(error) {
        clearLoader()
        ZeroData(roomContainer,error.message)
    }
}

export const getRoomsByCategoryName = async(roomContainer,category,page) => {
    try {
        loadSpinner(roomContainer)
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/rooms/?category=${category}&limit=4&page=${page}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            const {data} = res;
            clearLoader()
            if(data.length > 0){
                data.map(d => roomCard(d, roomContainer))
                insertLoadMoreBtnForRoomCategories(category)
            }else {
                page > 1 ?  ZeroData(roomContainer ,'There is no more active rooms for this category yet') : ZeroData(roomContainer ,'There is no active rooms for this category now')
            }   
        }
        else{
            clearLoader()
            ZeroData(roomContainer,res.message);
        }
    } catch(error) {
        clearLoader()
        ZeroData(roomContainer,error.message)
    }
}


//search for room
export const searchForRoom = async(roomContainer,value) => {
    try {
        loadSpinner(roomContainer)
        const response = await fetch(`https://audiocomms-podcast-platform.herokuapp.com/api/v1/rooms/search?s=${value}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = await response.json();
        
        if(res.status !== 'fail'){
            const {data} = res;
            clearLoader()
            data.length > 0 ? data.map(d => displayPodcasts(d)) : ZeroData(roomContainer ,`No rooms with ${value} name`)
        }
        else{
            clearLoader()
            ZeroData(roomContainer,res.message);
        }
    } catch(error) {
        clearLoader()
        ZeroData(roomContainer,error.message);
    }
}