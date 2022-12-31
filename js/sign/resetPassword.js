import { url } from '../config.js';
const mainContainer = document.querySelector('.main-container')
let feedBackDiv;
const submitBtn = document.querySelector('.submit-btn')
const form = document.querySelector('#resetPassword-form')//reset form
const password = document.querySelector('#password')
const confirmPassword = document.querySelector('#passwordConfirm')



const resetFeedback = (feed, message) => {
    let markup;
    if(feed === 'sucsses'){
        markup =  `
        <div class="feed-back sucsses">
            <p class="feed-back-text">your password had been reset</p>
            <a href="./signIn.html">go to login</a>
            <i class='bx bx-x clear-feed-back'></i>
        </div>
        `
    }
    else{
        markup =  `
        <div class="feed-back fail">
            <p class="feed-back-text">
               ${message ? message : 'password did not match'} 
            </p>
            <i class='bx bx-x clear-feed-back'></i>
        </div>
        `
    }
    mainContainer.insertAdjacentHTML('beforeend', markup)
    feedBackDiv =  document.querySelector('.feed-back')
    
    document.querySelector('.clear-feed-back').addEventListener('click', ()=>{
       clearFeedBack(feedBackDiv)
    })
}

const clearFeedBack  = (element) => {
    if(element) element.parentElement.removeChild(element)
    feedBackDiv = null
}


const getValues = ()=>{
    const data = {
        password: password.value,
        passwordConfirm: confirmPassword.value
    }

    if(data.password === data.passwordConfirm) {
        ResetPasswordReq(data)
    } else {
        resetFeedback('fail')
    }
    
}

const token = window.location.search.split('=')[1] //get from url

const ResetPasswordReq = async (data) => {
    submitBtn.textContent = 'Reseting password...'
    try{
        const response = await fetch(`${url}/api/v1/users/resetPassword/${token}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const res = await response.json();
        if(res.status !== 'fail'){
            submitBtn.textContent = 'Reset Password';
            resetFeedback('sucsses')
            form.reset();
        }
        else{
            submitBtn.textContent = 'Reset Password';
            resetFeedback('fail', res.message);
        }
    } catch(error) {
        submitBtn.textContent = 'Reset Password';
        resetFeedback('fail', error.message);
    }
}


form.addEventListener('submit', (e) => {
    e.preventDefault()
    if(feedBackDiv){
        clearFeedBack(feedBackDiv)
    }
    getValues()
})