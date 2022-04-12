import { getCategories } from '../utilities/getCategory.js';
import { createRoom } from './room.js';
const createRoomContainer = document.querySelector('.create-room-container')
const setRoomType = document.querySelector('.toggle-switch');
const typeHeader = document.querySelector('.type-header')
const typeText = document.querySelector('.type-text')
const createbtn = document.querySelector('.create-btn');
const getCategoryValue = document.querySelector('#categories')
const getRoomName = document.querySelector('.room-name input')


let roomType = 'private'


const fetchCategory = async() => {
    const cat = await getCategories();
    cat.map(c=> {
        const markup = `
        <option value=${c.name}>${c.name}</option>`
        getCategoryValue.insertAdjacentHTML('beforeend',markup)
    })
}

fetchCategory()

setRoomType.addEventListener("click" , () =>{
    setRoomType.classList.toggle("public");
    
    if(setRoomType.classList.contains("public")){
        typeHeader.innerText = "Public";
        typeText.innerText = "any one can join this room"
        roomType = 'public';
    }else{
        typeHeader.innerText = "Private";
        typeText.innerText = "only people have the link will join";
        roomType = 'private';
    }
});



createbtn.addEventListener('click' ,()=>{
    if(!getRoomName.value){
        alert('enter room name and make sure of other setup')
    } else {
        let rmVal = getRoomName.value;
        let catVal = getCategoryValue.value
        console.log(rmVal, catVal, roomType)

        //do request
        //when request is success
     
        createRoomContainer.classList.add('show-modal')
        //start load your room
        createRoom({
            name: rmVal,
            category: catVal,
            status: roomType
        });
        
    }
})

// if remote user comes to join a room
// check if url has a id or an name for room - if(id)
//then model must be hiden and the room for user