import { getAllMyFollowingEvents } from "../utilities/eventReq.js";

const user_avatar = JSON.parse(localStorage.getItem('user-data'));
const userImg = document.querySelector('#user-avatar')

const eventContainer = document.querySelector('.events-container')
let page = 1

//create event varialbes
const createEventForm = document.querySelector('#event-create-form');
const eventName = document.querySelector('#event-name');
const eventTime = document.querySelector('#event-time');
const eventDate = document.querySelector('#event-date');
const eventTextarea = document.querySelector('#event-textarea');

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

//-------------------------------------------------
//start create event
createEventForm.addEventListener('submit', (e)=> {
    e.preventDefault();
    const eventData = {
        name: eventName.value,
        description: eventTextarea.value,
        date: `${eventDate.value}, ${eventTime.value}`
    }
    if(eventData.name && eventData.description && eventDate.value && eventTime.value){
        console.log(eventData)
    }else{
        alert('All fields are requird')
    }
})





//show modal
creatEventBtn.addEventListener('click', ()=> {
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



window.addEventListener('load', () =>{
    insertUserImg()
    getAllMyFollowingEvents(eventContainer, page)
});



//dateObj = '2022-03-30T14:10:19.592Z'



  
// console.log(getDate('2022-03-30T14:10:19.592Z'))

/*
new Date('2018-01-01T18:00:00Z').toLocaleString('en-us', {month:'long'})
new Date(dateString).toLocaleString('en-us', {weekday:'long'})
*/