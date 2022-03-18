//import { url } from "../global";


//elements

const signupForm = document.querySelector('.signup-form');
const userName = document.getElementById('name');
const email = document.getElementById('Email');
const userType = document.getElementById('userType');
const country = document.getElementById('country');
const password = document.getElementById('Password');
const confirmPassword = document.getElementById('confirmPassword');
const signupBtn = document.querySelector('.submit-signup-btn');
const language = document.getElementById('language');

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
    //console.log(data);

    fetchData(data)
}



//event handlers



const url = 'https://audiocomms-podcast-platform.herokuapp.com';

 const fetchData = async(data) =>  {
    const response = await fetch(`${url}/api/v1/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const res = await response.json();
    console.log(res);
    if(res.status !== 'fail'){
        console.log(res);
        const {data: {user}} = res;
        const {token} = res;
        localStorage.setItem('user-data', JSON.stringify(user));
                localStorage.setItem('user-token', JSON.stringify(token));
                localStorage.setItem('isLoggedIn', true);
        window.location = "../home/index.html";
        
    }
    else{
        alert("please Enter Valid Data!");
    }
  }




signupForm.addEventListener('submit' ,(e) => {
    e.preventDefault();
    getValues();
})
