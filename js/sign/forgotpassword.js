const mainContainer = document.querySelector('.main-container')
let feedBackDiv;
const submitBtn = document.querySelector('.submit-btn')
const form = document.querySelector('.forgot-form')
const email = document.querySelector('#email')

const feedback = (feed, message) => {
    let markup;
    if(feed === 'sucsses'){
        markup =  `
        <div class="feed-back sucsses">
            <p class="feed-back-text">an email has been sent to you, please check your mail</p>
            <i class='bx bx-x clear-feed-back'></i>
        </div>
        `
    }
    else{
        markup =  `
        <div class="feed-back fail">
            <p class="feed-back-text">
               ${message ? message : 'something went wrong'} 
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
        email: email.value
    }
   
    forgotPasswordReq(data)
    
}

const forgotPasswordReq = async (data) => {
    submitBtn.textContent = 'Sending Email...'
    const response = await fetch("https://audiocomms-podcast-platform.herokuapp.com/api/v1/users/forgotPassword", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    const res = await response.json();

    if(res.status !== 'fail'){
        submitBtn.textContent = 'Send Email';
        feedback('sucsses')
    }
    else{
        submitBtn.textContent = 'Send Email';
        feedback('fail', res.message);
    }
}


form.addEventListener('submit', (e) => {
    e.preventDefault()
    if(feedBackDiv){
        clearFeedBack(feedBackDiv)
    }
    getValues()
})