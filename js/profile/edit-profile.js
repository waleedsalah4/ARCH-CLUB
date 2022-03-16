
const editForm = document.querySelector('.edit-form');
const chngPassForm = document.querySelector('.change-pass-form');
const submitEditBtn = document.querySelector('.submit-edit-btn');
const editUserName = document.querySelector('#editName');
const editEmail = document.querySelector('#editEmail');
const changePassBtn = document.querySelector('.change-pass');
const changePassFormBtn = document.querySelector('.submit-change-btn');
const deleteAcc = document.querySelector('.delete-acc');
const backbtn = document.querySelector('.back-btn');
const oldPassword = document.querySelector('#oldPassword');
const newPassword = document.querySelector('#newPassword');
const confirmPassword = document.querySelector('#confirmPassword');




//data validation

//1) edit form
const emailValidation = function(emailValue){
    const atIndx = emailValue.indexOf('@');
    const dotIndx = emailValue.indexOf('.');

    if(atIndx <2 || (dotIndx - atIndx) <2){
        alert('Please Enter a valid Email.')
        editEmail.focus();
        return false;
    }

    return true;
}


submitEditBtn.addEventListener('click',function(e){

    e.preventDefault();
    //console.log(editUserName.value);
    if(!editUserName.value && !editEmail.value){
        alert('Enter some changes to be submited :)');
    }

    emailValidation(editEmail.value);

})

//2)change password form

changePassFormBtn.addEventListener('click',function(e){
    e.preventDefault();

    if(!oldPassword.value || !newPassword.value || !confirmPassword.value){
        alert('All fields Are required.');
    }
    else { 
        
    //check if old password matches the stored one for user

    //check if new pass = confirm pass
    if(newPassword.value != confirmPassword.value){
        alert("confirm password again");
        confirmPassword.focus();
    }
}

    


});





//change password
changePassBtn.addEventListener('click',function(){

    //veiw backbtn
    backbtn.classList.remove('hidden');

    //delete the buttons
    changePassBtn.classList.add('hidden');
    deleteAcc.classList.add('hidden');

    //change form
    editForm.classList.add('hidden');
    chngPassForm.classList.remove('hidden');

});

backbtn.addEventListener('click',()=>{
   
    //delete backbtn
    backbtn.classList.add('hidden');

    //veiw the buttons
    changePassBtn.classList.remove('hidden');
    deleteAcc.classList.remove('hidden');

    //change form
    editForm.classList.remove('hidden');
    chngPassForm.classList.add('hidden');
})

