import { getAllMyFollowingEvents,createEventReq } from "../utilities/eventReq.js";
import { sideBarView } from "../sideBar/sideBarView.js";
import { eventsSideBarHref } from "../sideBar/sideBarHref.js";

const eventSidBar = document.querySelector('#events-sidebar')

const user_avatar = JSON.parse(localStorage.getItem('user-data'));
const userImg = document.querySelector('#user-avatar')

const eventContainer = document.querySelector('.events-container')
let eventPage = 1
let loadmore;

//create event varialbes
const createEventForm = document.querySelector('#event-create-form');
const eventName = document.querySelector('#event-name');
const eventTime = document.querySelector('#event-time');
const eventDate = document.querySelector('#event-date');
const eventTextarea = document.querySelector('#event-textarea');
const submitBtn = document.querySelector('.submit-btn')

//event modal to insert feedback inside it
const eventModal = document.querySelector('#event-modal')
let successfulReq;

//for showing and hiding modal
const closeModal = document.querySelector('#close-modal');
const creatEventBtn = document.querySelector('#create-event');
const modal = document.querySelector('#modal');


let dateObj;

//get user image
const insertUserImg = () => {
    
    if(user_avatar){
        const markup = `
            <img  src="${user_avatar.photo}" alt="user profile picture" class="circle-profile-img">
        `
        userImg.insertAdjacentHTML('beforeend', markup)
    }
    else{
        return;
    }
}


export const eventView = (evt) => {
    const markup = `
    <div class="event-component">
        <div class="user-data">
            <div class="user-photo">
                <img src="${evt.createdBy.photo}" alt="user-photo">
            </div>
            <div>
                <h4>${evt.createdBy.name}</h4>
                <p>${getDate(evt.createdAt)}</p>
            </div>
        </div>
        <div class="event-description">
            ${evt.description}
        </div>
        <div class="event-coming-date">
            <h6>comming at:</h6>
            <p>${getDate(evt.date)}</p>
        </div>
    </div>
    `
    eventContainer.insertAdjacentHTML('afterbegin', markup)
}

export const insertLoadMoreEventsBtn = () => {
    const markup =`
        <div class="load-more">
            <button class="load-more-btn">Load More</button>
        </div>
    `
    eventContainer.insertAdjacentHTML('beforeend', markup)

    loadmore = document.querySelector('.load-more')
    loadmore.addEventListener('click', () => {
        eventPage++
        getAllMyFollowingEvents(eventContainer, eventPage)
        clearLoadMore(loadmore)
    })
}

const clearLoadMore  = (element) => {
    if(element) {
        element.parentElement.removeChild(element)
    }
    //categorieLoadMore = null 
    loadmore = null;
}


const getDate = (date) => {
    dateObj = new Date(date);
    // date: dateObj.toDateString(),
    // time: formatAMPM(dateObj)
    return `${dateObj.toDateString()} at ${formatAMPM(dateObj)}`
}

function formatAMPM(date) {

    var hours = date.getHours()-2;
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}


const todayDate = () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();

    if (dd < 10) { dd = '0' + dd; }
    if (mm < 10) { mm = '0' + mm;} 
        
    let date = yyyy + '-' + mm + '-' + dd;
    return date
}

const dateAfterTwoWeeks = () => {
    let twoWeeks = 1000 * 60 * 60 * 24 * 13;
    let twoWeeksTime = new Date(new Date().getTime() + twoWeeks);
    let d = twoWeeksTime.getDate();
    let m = twoWeeksTime.getMonth() + 1;
    let y = twoWeeksTime.getFullYear();
    if (d < 10) { d = '0' + d; }
    if (m < 10) { m = '0' + m;}
    let formattedDate = y + '-' + m + '-' + d ;

   return formattedDate
}

//-------------------------------------------------
//start create event
createEventForm.addEventListener('submit', (e)=> {
    e.preventDefault();

    const eventDataObj = {
        name: eventName.value,
        description: eventTextarea.value,
        date: new Date(`${eventDate.value}, ${eventTime.value}`).toLocaleString()
    }
    if(eventDataObj.name && eventDataObj.description && eventDate.value && eventTime.value){
        // console.log(eventDataObj)
        createEventReq(eventDataObj, submitBtn)
    }else{
        alert('All fields are requird')
    }
})



//excute when request is success
export const clearModalAndForm = () => {
    createEventForm.reset()
    modal.classList.remove('show-modal')
}

//insert success feedback when create req is success
export const successFeedBack = () => {
    const markup = `
    <div class="feed-back success">
        <p class="feed-back-text">
        Event has been created successfuly, go to your profile to see it
        </p>
        <div class="clear-feed-back">
            <i class='fa-solid fa-x'></i>
        </div>
    </div>
    `
    eventContainer.insertAdjacentHTML('afterbegin', markup)
    successfulReq = document.querySelector('.feed-back')

    document.querySelector('.clear-feed-back').addEventListener('click', ()=>{
        clearSuccessFeedBack(successfulReq)
    })
}
 
const clearSuccessFeedBack  = (element) => {
    if(element) element.parentElement.removeChild(element)
    successfulReq = null
}

//show modal
creatEventBtn.addEventListener('click', ()=> {
    let minAtrr = todayDate()
    let maxAtrr = dateAfterTwoWeeks();
    eventDate.setAttribute('min', minAtrr)
    eventDate.setAttribute('max', maxAtrr)
    modal.classList.add('show-modal')
})

//hide modal
closeModal.addEventListener('click', ()=> {
    modal.classList.remove('show-modal')
})

//hide modal outside  click
window.addEventListener('click', e => {
    e.target == modal ? modal.classList.remove('show-modal') : false;
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


window.addEventListener('load', () =>{
    sideBarView(eventsSideBarHref, eventSidBar)
    insertUserImg()
    getAllMyFollowingEvents(eventContainer, eventPage)
});



//dateObj = '2022-03-30T14:10:19.592Z'



  
// console.log(getDate('2022-03-30T14:10:19.592Z'))

/*
new Date('2018-01-01T18:00:00Z').toLocaleString('en-us', {month:'long'})
new Date(dateString).toLocaleString('en-us', {weekday:'long'})
*/