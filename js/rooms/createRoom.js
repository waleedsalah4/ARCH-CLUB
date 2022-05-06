// import { getCategories } from '../utilities/getCategory.js';
import { createRoom, joinRoomFun} from './room.js';
// const createRoomContainer = document.querySelector('.create-room-container')
const createJoinMainContainer = document.querySelector('#create-join-container') //hold event-modal
const createAndJoinModalcontainer = document.querySelector('#event-modal')//hold content
let setRoomType;
let typeHeader;
let typeText;
let setRecoredRoom;
let recordText;
let createbtn;
const getCategoryValue = document.querySelector('#categories')
let getRoomName;
const joinPrivateRoomBtn = document.querySelector('#joinPrivateRoomBtn')
const showCreateModal = document.querySelector('#show-create-modal')

import { snackbar } from '../utilities/snackbar.js';


let roomType = 'public';
let recordRoom = false;



// const fetchCategory = async() => {
//     const cat = await getCategories();
//     cat.map(c=> {
//         const markup = `
//         <option value=${c.name}>${c.name}</option>`
//         getCategoryValue.insertAdjacentHTML('beforeend',markup)
//     })
// }

// fetchCategory()



const addJoinPrivateRoom = () => {
    createAndJoinModalcontainer.innerHTML = '';
    const markup = `
    <form class="join-private-room" id="join-private-room">
        <div class="room-id">
            <input type="text" id="get-id" placeholder="Enter room id">
        </div>
        <div class="room-id">
            <input type="submit" value="join" class="join-private">
        </div>
    </form>
    `
    createAndJoinModalcontainer.innerHTML = markup;
    document.querySelector('#join-private-room').addEventListener('submit', (e)=>{
        e.preventDefault();
        if(document.querySelector('#get-id').value.length > 0) {
            joinRoomFun(document.querySelector('#get-id').value)
            console.log(document.querySelector('#get-id').value)
        } else{
            snackbar(document.getElementById('snackbar-container'),'error', `<b>Error: </b> please enter valid id`, 5000);
        }
    })

}


const addCreateRoomForm = () => {
    createAndJoinModalcontainer.innerHTML = ''
    const markup = `
    <div class="create-room">
        <div class="header">
            <h2>SetUp your Room!</h2>
        </div>
        <div class="room-name">
            <input type="text" placeholder="room Name">
        </div>
        <div class="category-select">
            <div>
                <label for="categories">Category</label>
            </div>
            <div>
                <select id="categories">
                    <option value="ai">ai</option>
                    <option value="education">education</option>
                    <option value="engineering">engineering</option> 
                    <option value="football">football</option>
                    <option value="gaming">gaming</option>
                    <option value="history">history</option>
                    <option value="just chatting">just chatting</option>
                    <option value="programming">programming</option>
                    <option value="science">science</option>
                    <option value="storytelling">storytelling</option>
                </select>
            </div>
        </div>
        <div class="room-type">
            <div>
                <h4 class="type-header">Public</h4>
                <h6 class="type-text">Any one can join this room</h6>
            </div>
                <div class="toggle-switch" id="toggle-status">
                    <span class="switch"></span> 
                </div>
        </div>
        <div class="room-type">
            <div>
                <h4 class="record-header">Record</h4>
                <h6 class="record-text">Room will not be recorded</h6>
            </div>
            <div class="toggle-switch" id="toggle-record">
                <span class="switch"></span> 
            </div>
        </div>
        <div class="create-btn">
            <button>Create</button>
        </div>
    </div>
    `
    createAndJoinModalcontainer.innerHTML = markup;
    getRoomName = document.querySelector('.room-name input')
    setRoomType = document.querySelector('#toggle-status')
    typeHeader = document.querySelector('.type-header')
    typeText = document.querySelector('.type-text')
    setRecoredRoom = document.querySelector('#toggle-record');
    recordText = document.querySelector('.record-text')
    createbtn = document.querySelector('.create-btn');
    
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
            // alert('enter room name and make sure of other setup')

            snackbar(document.getElementById('snackbar-container'),'error', `<b>Error: </b>  enter room name and make sure of other setup`, 5000);
        } else {
            let rmVal = getRoomName.value;
            let catVal = document.querySelector('#categories').value
            console.log(rmVal,catVal ,roomType, recordRoom)

        
            //start load your room
            createRoom({
                name: rmVal,
                category: catVal,
                status: roomType,
                isRecording: recordRoom       
            });
            
        }
    })
}


joinPrivateRoomBtn.addEventListener('click', ()=>{
    createJoinMainContainer.classList.add('show-modal')
    addJoinPrivateRoom()
})
showCreateModal.addEventListener('click', ()=>{
    createJoinMainContainer.classList.add('show-modal')
    addCreateRoomForm()
})

window.addEventListener('click', e => {
    e.target == createJoinMainContainer ? createJoinMainContainer.classList.remove('show-modal') : false;
})

//run when window loads
const chechIfUserIsSign = () => {
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'))
    if(isLoggedIn === true) {
        return
    } else{
        window.location = '/';
    }
}
chechIfUserIsSign()