import { clearLoader } from "../loader.js";
import { getDate ,popupCancel, popupMessage} from "../utilities/helpers.js";
import { deleteEventById ,updateEvent ,getEventById} from "../utilities/profileReq.js";
const eventContainer = document.querySelector('.events-content');
let eventObject=[];
export const eventView = (evt) => {
    eventObject.push(evt);
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
                <div class="update-event">
                    <i class="fa-solid fa-pen-to-square event-icon"></i>
                </div>
                <div class="delete-event">
                    <i class="fa-solid fa-trash-can event-icon"></i>
                </div>
            </div>
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
    `;
    clearLoader();
    eventContainer.insertAdjacentHTML('beforeend', markup);
    
    /** error at update and delete event **/
   
}

export const puttingHandlers = function(){
    
    //update event 
    //const updateIcone = document.querySelector('#update-event');
   /*  document.querySelector('#update-event').addEventListener('click',function(){
        updateEventHandling(evt);
    }); */

    document.querySelectorAll('.update-event').forEach(updtBtn=>{
        updtBtn.addEventListener('click',function(e){
            console.log(e.target.closest('.event-component').id.split('-')[2]);
            let evtID = e.target.closest('.event-component').id.split('-')[2];
            console.log(e.target.closest('.event-component'));
            //console.log(eventObject);
            getEventById(evtID);
            // updateEventHandling(evt,evtID);
        })
    })


    //delete Event
    document.querySelectorAll('.delete-event').forEach(ele=>{
        ele.addEventListener('click', (e)=> {
            console.log(e.target.closest('.event-component').id.split('-')[2]);
            let evtID = e.target.closest('.event-component').id.split('-')[2];
            document.querySelector('.delete-event-popup-overlay').classList.remove('hidden');
            document.querySelector('#cancel-event-deleation').addEventListener('click',()=>document.querySelector('.delete-event-popup-overlay')
            .classList.add('hidden'));
    
            document.querySelector('.delete-event-popup-overlay').addEventListener('click',function(e){
                popupCancel('delete-event-popup-overlay',e);
            });
    
            document.querySelector('.confirm-event-deleation').addEventListener('click',function(e){
                document.querySelector('.delete-event-popup-overlay').classList.add('hidden');
                //deleteEventById(evt._id);
                console.log(evtID);
                deleteEventById(evtID);
            })
        })
    });

}

 export const deletElmenetFromUi = (id) => {
    let element = document.querySelector(`#event-component-${id}`)
    element.parentElement.removeChild(element)
}


//display and hide of the form
export const updateEventHandling =  function(event,evtID){
    console.log(event);
    document.querySelector('.update-event-popup-overlay').classList.remove('hidden');

    document.querySelector('.update-event-popup-overlay').addEventListener('click',function(e){
        popupCancel('update-event-popup-overlay',e) });
    
    document.querySelector('.submit-btn').addEventListener('click',async function(e){
        e.preventDefault();
        const evntName = document.querySelector('#update-event-name');
        const evntDate = document.querySelector('#update-event-date');
        const evntDescription = document.querySelector('#update-event-textarea');
        const evntTime = document.querySelector('#update-event-time');
        if( !(evntDate.value || evntDescription.value || evntName.value || evntTime.value) ){
            popupMessage(`You Must Edit at Least one filed!`);
        }

        else{
            const data = {
                
                "name": evntName.value!=''? evntName.value: event.value,
                "description": evntDescription.value!=''? evntDescription.value : event.description,
                "date": evntDate.value!=''? ` ${evntDate.value} ${evntTime.value!=''? `, ${evntTime.value}` : ''}`: 
                        evntTime.value!=''? `${(new Date(event.date)).getMonth()+1}/${(new Date(event.date)).getDate()}/${(new Date(event.date)).getFullYear()} ,${evntTime.value} ` : event.date
                }
            console.log(data);
            document.querySelector('.update-event-popup-overlay').classList.add('hidden');
            await updateEvent(evtID,data);
            //document.querySelector('.user-Events').click();
            }

            
        });
}

