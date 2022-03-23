const email = document.querySelector('#email')
const password = document.querySelector('#password')
const submitBtn = document.querySelector('.submit-btn')

const chechIfUserIsSign = () => {
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'))
    if(isLoggedIn === true) {
        window.location = '../home/index.html'
    } else{
        return
    }
}

chechIfUserIsSign()

function getValues () {
    const data = {
        email: email.value,
        password: password.value,
    }

    if(!data.email || data.password.length < 6){
        alert('invalid data')
    } else {
        fetchData(data)
    }
}


// const url = 'https://audiocomms-podcast-platform.herokuapp.com/';

 const fetchData = async(data) =>  {
    try{
        const response = await fetch("https://audiocomms-podcast-platform.herokuapp.com/api/v1/users/login", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const res = await response.json();
    
        if(res.status !== 'fail'){
            console.log(res);
            const {data: {user}} = res;
            const {token} = res;
    
            localStorage.setItem('user-data', JSON.stringify(user));
            localStorage.setItem('user-token', JSON.stringify(token));
            localStorage.setItem('isLoggedIn', true);
    
            window.location = '../home/index.html'
        }
        else{
            alert(`${res.message}`);
        }
    } catch(error){
        alert(`${error.message}`);
    }
  
  }




  submitBtn.addEventListener('click' ,(e) => {
    e.preventDefault()
    getValues();
})