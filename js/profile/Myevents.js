import { getDate, todayDate, dateAfterTwoWeeks } from "../utilities/helpers.js";
import { deleteEventById, updateEventById } from "../utilities/profileRequests.js";


export const Events = (evt,container, otherUser) => {
    const markup = `
    <div class="event-component" id="event-component-${evt._id}">
        <div class="event-header">
            <div class="user-data">
                <div class="user-photo">
                    <img src="${evt.createdBy.photo}" alt="user-photo">
                </div>
                <div>
                    <h4>${evt.createdBy.name}</h4>
                    <p>${getDate(evt.createdAt)}</p>
                </div>
            </div>
           ${otherUser ? '' : `
            <div class="event-actions">
                <div class="update-event" id="update-event-${evt._id}">
                    <i class="fa-solid fa-pen-to-square event-icon"></i>
                </div>
                <div class="delete-event" id="delete-event-${evt._id}">
                    <i class="fa-solid fa-trash-can event-icon"></i>
                </div>
            </div>`}
        </div>
        <div class="event-description">
            <div>Event Title:  ${evt.name}</div>
            About Event:  ${evt.description}
        </div>
        <div class="event-coming-date">
            <h6>comming at:</h6>
            <p>${getDate(evt.date)}</p>
        </div>
    </div>
    `
    container.insertAdjacentHTML('beforeend', markup)

    if(document.querySelector(`#delete-event-${evt._id}`)){
        document.querySelector(`#delete-event-${evt._id}`).addEventListener('click', () =>{
            console.log('i am in delete event')
            handleDeletePopUp(evt._id)
        })
    }

    if(document.querySelector(`#update-event-${evt._id}`)){
        document.querySelector(`#update-event-${evt._id}`).addEventListener('click', () =>{
            console.log('i am in update event')
            handleUpdateEvent(evt)
        })
    }
}


const handleDeletePopUp = (id) => {
    document.querySelector('.delete-event-popup-overlay').innerHTML= ''
    const markup = `
    <div class="popup-box">
        <p class="popup-message">Are You Sure You Want To Delete This Event?</p>
        <div class="btnHolder">
            <input type="button" class="btn-following-profile delBtn confirm-event-deleation"  value="Yes">
            <input type="button" class="btn-following-profile delBtn" id="cancel-event-deleation" value="Cancel">
        </div>
        
    </div>
    `
    document.querySelector('.delete-event-popup-overlay').insertAdjacentHTML('beforeend', markup)
    document.querySelector('.delete-event-popup-overlay').classList.remove('hidden')

    document.querySelector('#cancel-event-deleation').addEventListener('click',() => {
        console.log('cancel')
        document.querySelector('.delete-event-popup-overlay').classList.add('hidden')
        document.querySelector('.delete-event-popup-overlay').innerHTML= ''
    })

    document.querySelector('.confirm-event-deleation').addEventListener('click', async () => {
        console.log('delete')
        await deleteEventById(id, document.querySelector('#snackbar-container'))
        document.querySelector('.delete-event-popup-overlay').classList.add('hidden')
        document.querySelector('.delete-event-popup-overlay').innerHTML= ''
    })
}

export const deleteEventFromUI = (id) => {
    if(document.querySelector(`#event-component-${id}`)){
        console.log('deleted')
        document.querySelector(`#event-component-${id}`).parentElement.removeChild(document.querySelector(`#event-component-${id}`))
    }
}



const handleUpdateEvent = async (evt) => {
    document.querySelector('.update-event-popup-overlay').innerHTML= '';
    console.log(evt)
    const markup = `
    <div class="popup-box">       
        <div class="modal-content">
            <form class="modal-form" id="event-create-form">
                <div>
                    <input type="text" id="update-event-name" placeholder="Enter title" class="form-input" value='${evt.name}'>
                </div>
                <div>
                    <input type="date" id="update-event-date" class="form-input" min="${todayDate()}" max="${dateAfterTwoWeeks()}">
                </div>
                <div> 
                    <input type="time" id="update-event-time"  class="form-input">
                </div>
                <div>
                    <textarea name="description" class="form-input" id="update-event-textarea"
                    >${evt.description}</textarea>
                </div>
                <div class='update-actions'>
                <button type="submit" class="submit-btn"> Update</button>
                <button class="submit-btn" id="cancel-update">Cancel</button>
            </form>
        </div>
    </div>
    `
    document.querySelector('.update-event-popup-overlay').insertAdjacentHTML('beforeend', markup)
    document.querySelector('.update-event-popup-overlay').classList.remove('hidden')

    document.querySelector('#cancel-update').addEventListener('click',(e) => {
        e.preventDefault()
        console.log('cancel')
        document.querySelector('.update-event-popup-overlay').classList.add('hidden')
        document.querySelector('.update-event-popup-overlay').innerHTML= ''
    })

    document.querySelector('.submit-btn').addEventListener('click',  (e) => {
        e.preventDefault()
        console.log('update')

        let updatedName = document.querySelector('#update-event-name').value;
        let updatedDescription = document.querySelector('#update-event-textarea').value
        let updatedTime = document.querySelector('#update-event-time').value
        let updatedDate = document.querySelector('#update-event-date').value

        if(updatedName && updatedDate && updatedDescription && updatedTime) {
            let updatedData = {
                name: updatedName,
                description: updatedDescription,
                date: new Date(`
                    ${updatedTime}
                    , ${updatedDate}`
                ).toISOString()
            }
            
            updateEventById(
                evt._id, 
                updatedData,
                document.querySelector('#snackbar-container'),
                document.querySelector('.events-components')
            )
            // console.log(updatedData)
            document.querySelector('.update-event-popup-overlay').classList.add('hidden')
            document.querySelector('.update-event-popup-overlay').innerHTML= ''
        } else {
            alert('all fields are required')
        }
    })
}