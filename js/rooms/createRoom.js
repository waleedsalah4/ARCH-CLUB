
import { createRoom} from './room.js';

const setRoomType = document.querySelector('.toggle-switch');
const typeHeader = document.querySelector('.type-header')
const typeText = document.querySelector('.type-text')
const createbtn = document.querySelector('.create-btn');
const setRecoredRoom = document.querySelector('#toggle-record');
const recordText = document.querySelector('.record-text')
const getRoomName = document.querySelector('.room-name input')

import { snackbar } from '../utilities/snackbar.js';


let roomType = 'public';
let recordRoom = false;



setRoomType.addEventListener("click" , () =>{
    setRoomType.classList.toggle("public");
    
    if(!setRoomType.classList.contains("public")){
        typeHeader.innerText = "Public";
        typeText.innerText = "any one can join this room"
        roomType = 'public';
    }else{
        typeHeader.innerText = "Private";
        typeText.innerText = "only people have the link will join";
        roomType = 'private';
    }
});

setRecoredRoom.addEventListener("click" , () =>{
    setRecoredRoom.classList.toggle("recorded");
    
    if(setRecoredRoom.classList.contains("recorded")){
        recordText.innerHTML= ''
        recordText.innerHTML='Record Room to listen as podcast later'
        recordRoom = true;
    }else{
        recordText.innerHTML= ''
        recordText.innerHTML='Room will not be recorded'
        recordRoom = false;
    }
});



createbtn.addEventListener('click' ,()=>{
    if(!getRoomName.value){

        snackbar(document.getElementById('snackbar-container'),'error', `<b>Error: </b>  enter room name and make sure of other setup`, 5000);
    } else {
        let rmVal = getRoomName.value;
        let catVal = document.querySelector('#categories').value
        console.log(rmVal,catVal ,roomType, recordRoom)
        
       // start load your room
        createRoom({
            name: rmVal,
            category: catVal,
            status: roomType,
            isRecording: recordRoom       
        });
        
    }
})

