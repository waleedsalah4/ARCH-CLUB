import { getDate } from "../utilities/helpers.js";
import { deleteEventById } from "../utilities/profileReq.js";

export const eventView = (evt,eventContainer) => {
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
            <div class="event-actions">
                <div>
                    <i class="fa-solid fa-pen-to-square event-icon"></i>
                </div>
                <div id="delete-event">
                    <i class="fa-solid fa-trash-can event-icon"></i>
                </div>
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

    document.querySelector('#delete-event').addEventListener('click', ()=> {
        deleteEventById(evt._id)
    })
}

 export const deletElmenetFromUi = (id) => {
    let element = document.querySelector(`#event-component-${id}`)
    element.parentElement.removeChild(element)
}