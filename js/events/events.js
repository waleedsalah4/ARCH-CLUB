const user_avatar = JSON.parse(localStorage.getItem('user-data'));

const userImg = document.querySelector('#user-avatar')

//for showing and hiding modal
const closeModal = document.querySelector('#close-modal');
const creatEventBtn = document.querySelector('#create-event');
const modal = document.querySelector('#modal');


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
});