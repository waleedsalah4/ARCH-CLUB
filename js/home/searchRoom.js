import { searchForRoom } from "./fetchRooms.js";
const searchBar = document.querySelector('#search-room')
const roomContainer = document.querySelector('.rooms')
searchBar.addEventListener('keyup', (e) => {
    if (e.keyCode == 13){
        if(searchBar.value) {
            roomContainer.innerHTML = ''
            searchForRoom(roomContainer,searchBar.value)
        } 
    }
})