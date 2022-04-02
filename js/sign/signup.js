const mainContainer = document.querySelector('.main-container')
const signupForm = document.querySelector('.signup-form');
const userName = document.getElementById('name');
const email = document.getElementById('Email');
const userType = document.getElementById('userType');
const country = document.getElementById('country');
const password = document.getElementById('Password');
const confirmPassword = document.getElementById('confirmPassword');
const signupBtn = document.querySelector('.submit-btn');
const language = document.getElementById('language');
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


const signUpFeedback = (message) => {
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

//helpers

function getValues () {
  const data = {
        name: userName.value,
        email: email.value,
        country: country.value,
        language: language.value,
        userType: userType.value,
        password: password.value,
        passwordConfirm: confirmPassword.value,
  }
  if(data.name && data.email && data.password && data.passwordConfirm){
    fetchData(data)
  } else {
    signUpFeedback('all fields are required')
  }

}



//event handlers



const url = 'https://audiocomms-podcast-platform.herokuapp.com';

 const fetchData = async(data) =>  {
  try{
    signupBtn.textContent = 'signing...'
    const response = await fetch(`${url}/api/v1/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const res = await response.json();
    // console.log(res);
    if(res.status !== 'fail'){
        // console.log(res);
        signupBtn.textContent = 'Sign Up';
        const {data: {user}} = res;
        const {token} = res;
        localStorage.setItem('user-data', JSON.stringify(user));
        localStorage.setItem('user-token', JSON.stringify(token));
        localStorage.setItem('isLoggedIn', true);
        window.location = "../home/index.html";
        
    }
    else{
      signupBtn.textContent = 'Sign Up';
      signUpFeedback(res.message)
    }
  } catch(error) {
    signupBtn.textContent = 'Sign Up';
    signUpFeedback(error.message);
  }
   
}




signupForm.addEventListener('submit' ,(e) => {
    e.preventDefault();
    if(feedBackDiv){
      clearFeedBack(feedBackDiv)
    }
    getValues();
})