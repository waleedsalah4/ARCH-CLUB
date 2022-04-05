import { getDate } from "../utilities/helpers.js";

export const eventView = (evt,eventContainer) => {
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
