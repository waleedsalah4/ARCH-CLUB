
import {updateEvent,getEventById,deleteEventById} from '../utilities/profileReq.js';
import { getDate ,popupCancel, popupMessage} from "../utilities/helpers.js";
let evtID;
class Myevents {

    eventContainer = document.querySelector('.events-content');
    eventPage = 1
    loadmore;
    constructor(){
        this.cancelDeleation();
    }

    renderEvent(data){

        if(data.length!=0){
            data.forEach(evt=>this.eventContainer.insertAdjacentHTML('beforeend',this.markup(evt)))
            console.log('render events');
            this.puttingHandlers();
            
        }

        
    }

    puttingHandlers = function(){
    
        //update event 
     
        document.querySelectorAll('.update-event').forEach(updtBtn=>{
            updtBtn.addEventListener('click',async function(e){
                console.log(e.target.closest('.event-component').id.split('-')[2]);
                evtID = e.target.closest('.event-component').id.split('-')[2];
                console.log(e.target.closest('.event-component'));
                //console.log(eventObject);
                await getEventById(evtID);
                // updateEventHandling(evt,evtID);
            })
        })
    
    
        //delete Event
        document.querySelectorAll('.delete-event').forEach(ele=>{
            console.log("how");
            ele.addEventListener('click', (e)=> {
                console.log(e.target.closest('.event-component').id.split('-')[2]);
                evtID = e.target.closest('.event-component').id.split('-')[2];
                document.querySelector('.delete-event-popup-overlay').classList.remove('hidden');
              
            })
        });
    
    }

    cancelDeleation = function(){
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
    }



    updateEventHandling =  function(event,evtID){
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
                document.querySelector('.user-Events').click();
                }
    
                
            });
    }

    deletElmenetFromUi = (id) => {
        let element = document.querySelector(`#event-component-${id}`)
        element.parentElement.removeChild(element)
    }


    insertLoadMoreEventsBtn = (fnc) => {
        const markup =`
            <div class="load-more-events custom-center">
                <button class="load-more-btn ">Load More</button>
            </div>
        `
        this.eventContainer.insertAdjacentHTML('beforeend', markup)
    
        this.loadmore = document.querySelector('.load-more-events')
        this.loadmore.addEventListener('click', () => {
            this.eventPage++
            fnc(this.eventContainer, this.eventPage,true)
            this.clearLoadMore(this.loadmore)
        })
    }
    
    clearLoadMore  = (element) => {
        if(element) {
            element.parentElement.removeChild(element)
        }
        this.loadmore = null;
    }
    

    markup(evt){
        return `
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
        `
    }
}



export default new Myevents();