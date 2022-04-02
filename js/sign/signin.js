const email = document.querySelector('#email')
const password = document.querySelector('#password')
const submitBtn = document.querySelector('.submit-btn')
const mainContainer = document.querySelector('.main-container')
let feedBackDiv;

const chechIfUserIsSign = () => {
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'))
    if(isLoggedIn === true) {
        window.location = '../home/index.html'
    } else{
        return
    }
}

chechIfUserIsSign()

const signInFeedback = (message) => {
    let markup = `
        <div class="feed-back fail">
            <p class="feed-back-text">
               ${message ? message : 'password did not match'} 
            </p>
            <i class='bx bx-x clear-feed-back'></i>
        </div>
    `
    mainContainer.insertAdjacentHTML('afterbegin', markup)
    feedBackDiv =  document.querySelector('.feed-back')
    
    document.querySelector('.clear-feed-back').addEventListener('click', ()=>{
       clearFeedBack(feedBackDiv)
    })
  }
  
  const clearFeedBack  = (element) => {
    if(element) element.parentElement.removeChild(element)
    feedBackDiv = null
  }


function getValues () {
    const data = {
        email: email.value,
        password: password.value,
    }

    if(!data.email || data.password.length < 6){
        signInFeedback('invalid data')
    } else {
        fetchData(data)
    }
}


// const url = 'https://audiocomms-podcast-platform.herokuapp.com/';

 const fetchData = async(data) =>  {
    try{
        submitBtn.textContent = 'logging...'
        const response = await fetch("https://audiocomms-podcast-platform.herokuapp.com/api/v1/users/login", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const res = await response.json();
    
        if(res.status !== 'fail'){
            // console.log(res);
            submitBtn.textContent = 'Login'
            const {data: {user}} = res;
            const {token} = res;
    
            localStorage.setItem('user-data', JSON.stringify(user));
            localStorage.setItem('user-token', JSON.stringify(token));
            localStorage.setItem('isLoggedIn', true);
    
            window.location = '../home/index.html'
        }
        else{
            submitBtn.textContent = 'Login'
            signInFeedback(res.message)
        }
    } catch(error){
        submitBtn.textContent = 'Login'
        signInFeedback(res.message)
    }
  
  }




  submitBtn.addEventListener('click' ,(e) => {
    e.preventDefault()
    if(feedBackDiv){
        clearFeedBack(feedBackDiv)
      }
    getValues();
})