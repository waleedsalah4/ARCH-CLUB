import { loadSpinner, clearLoader } from '../loader.js';
import { homeSideBarHref } from '../sideBar/sideBarHref.js';
import { sideBarView } from '../sideBar/sideBarView.js';
import { getCategories } from '../utilities/getCategory.js';
import { getAllRooms, getRoomsByCategoryName } from './fetchRooms.js';
import { addJoinPrivateRoom } from './joinPrivateRoomCard.js';

// const user_avatar = JSON.parse(localStorage.getItem('user-data'));
// const userImg = document.querySelector('#user-avatar')

// const homeSideBar = document.querySelector('#home-sideBar')
const homeSideBar = document.querySelector('.insertLinks')

const joinPrivateRoomModal = document.querySelector('#join-private-container');
const JoinModalcontainer = document.querySelector('#event-modal')//hold content

const joinPrivateRoomBtn = document.querySelector('#join-private')

const homeMainContent = document.querySelector('.main-content') // to insert load more btn in it
const roomContainer = document.querySelector('.rooms')
const categoryContainer = document.querySelector('.category')

let loadmore;
let roomCategorieLoadMore;
let roomCategoryItemsPage = 1;
let roomPage = 1;
let categoreisButtons = [];




//load category

const addAllCatgorydiv = () => {
    const markup = `
    <div class="categorie-component active">All</div>
    `
    categoryContainer.insertAdjacentHTML('beforeend', markup)
}

const categoryItems = (catItem) => {
    const markup = `
        <div class="categorie-component">${catItem.name}</div>
    `;
    categoryContainer.insertAdjacentHTML('beforeend', markup)
}

const createCategory = async() => {
    loadSpinner(categoryContainer);

    const cat = await getCategories();
    
    clearLoader();
    addAllCatgorydiv();
    cat.map(c=> categoryItems(c))

    categoreisButtons= Array.from(document.querySelectorAll('.categorie-component'))
    // console.log(categoreisButtons)

// button actions
    for(let i=0; i<categoreisButtons.length; i++){
        categoreisButtons[i].onclick = function(){
            removeAllCtegorActive();

            categoreisButtons[i].classList.add('active')
            
            //reset room container 
            roomContainer.innerHTML = '';
            // loadSpinner(roomContainer);
            if(categoreisButtons[i].textContent === 'All'){
                clearLoadMoreRooms(loadmore)
                //clearLoadMoreRooms(roomCategorieLoadMore)
                if(roomCategorieLoadMore){
                    roomCategorieLoadMore.parentElement.removeChild(roomCategorieLoadMore)
                    roomCategorieLoadMore = null
                }
                roomPage = 1
                getAllRooms(roomContainer,roomPage)

            } else {
                clearLoadMoreRooms(loadmore)
                if(roomCategorieLoadMore){
                    roomCategorieLoadMore.parentElement.removeChild(roomCategorieLoadMore)
                    roomCategorieLoadMore = null
                }
                roomCategoryItemsPage = 1
                console.log(categoreisButtons[i].textContent, roomCategoryItemsPage)
                getRoomsByCategoryName(roomContainer,categoreisButtons[i].textContent,roomCategoryItemsPage);
                // insertLoadMoreBtnForCategories(categoreisItems[i].textContent)
               
                
            }
            // clearLoader()
            // console.log(categoreisItems[i].textContent)
        }
    }
}
createCategory();








function removeAllCtegorActive() {
    categoreisButtons.forEach(btn =>
        btn.classList.remove('active')
    );
}


export const insertLoadMoreRoomsBtn = () => {
    const markup =`
        <div class="load-more">
            <button class="load-more-btn">Load More</button>
        </div>
    `
    homeMainContent.insertAdjacentHTML('beforeend', markup)

    loadmore = document.querySelector('.load-more')
    loadmore.addEventListener('click', () => {
        roomPage++
        getAllRooms(roomContainer,roomPage)
        clearLoadMoreRooms(loadmore)
    })
}

export const insertLoadMoreBtnForRoomCategories = (value) => {
    console.log(value)
    const markup =`
        <div class="load-more-category">
            <button class="load-more-btn">Load More</button>
        </div>
    `
    homeMainContent.insertAdjacentHTML('beforeend', markup)

    roomCategorieLoadMore = document.querySelector('.load-more-category')
    roomCategorieLoadMore.addEventListener('click', () => {
        roomCategorieLoadMore.parentElement.removeChild(roomCategorieLoadMore)
        roomCategorieLoadMore = null
        roomCategoryItemsPage++
        console.log(roomCategoryItemsPage)
        getRoomsByCategoryName(roomContainer,value, roomCategoryItemsPage)
        
    })
}


const clearLoadMoreRooms  = (element) => {
    if(element) {
        element.parentElement.removeChild(element)
    }
    //categorieLoadMore = null 
    loadmore = null;
}



joinPrivateRoomBtn.addEventListener('click', ()=> {
    joinPrivateRoomModal.classList.add('show-modal')
    addJoinPrivateRoom(JoinModalcontainer)
})

window.addEventListener('click', e => {
    e.target == joinPrivateRoomModal ? joinPrivateRoomModal.classList.remove('show-modal') : false;
})

window.addEventListener('load', ()=> {
    sideBarView(homeSideBarHref,homeSideBar)
    getAllRooms(roomContainer, roomPage)
})

