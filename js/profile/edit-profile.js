import { popupMessage } from "../utilities/helpers.js";
import { deleteMe,updatePassword ,updateMe, getMe} from "../utilities/profileEditReq.js";
import { sideBarView } from "../sideBar/sideBarView.js";
import { profileSideBarHref } from "../sideBar/sideBarHref.js";




const editForm = document.querySelector('.edit-form');
const chngPassForm = document.querySelector('.change-pass-form');
const submitEditBtn = document.querySelector('.submit-edit-btn');
const editUserName = document.querySelector('#editName');
const editEmail = document.querySelector('#editEmail');
const changePassBtn = document.querySelector('.change-pass');
const changePassFormBtn = document.querySelector('.submit-change-btn');
const deleteAcc = document.getElementById('delete-acc');
const backbtn = document.querySelector('.back-btn');
const oldPassword = document.querySelector('#oldPassword');
const newPassword = document.querySelector('#newPassword');
const confirmPassword = document.querySelector('#confirmPassword');
const url = 'https://audiocomms-podcast-platform.herokuapp.com';
const userName = document.querySelector('.user-name');
const userPhoto = document.querySelector('.user-photo');
const openChngBioBtn = document.querySelector('.edit-bio');
const popupOverlayBio = document.querySelector('.popup-overlay-bio');




const editProfileSideBar = document.querySelector('#edit-profile-sidbar')

/////////////////////////// render user data ////////////////////



const renderUser = function(){
    const user = JSON.parse(localStorage.getItem('user-data'));
    editUserName.placeholder = user.name;
    editEmail.placeholder = user.email;
    userName.textContent = user.name;
    userPhoto.src = user.photo;

}


export const init = async function(){
    await getMe();
    renderUser();
}


window.addEventListener('load', () => {
    sideBarView(profileSideBarHref, editProfileSideBar)
    init()
});

//data validation

//1) edit form
/*
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
*/



//change password form

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



///////////////////////////////////////////////// change email or name /////////////////////////////////////////////////////////

const getChangeNameEmail = async function(){
    
    const changeData = {
        name: editUserName.value? editUserName.value: editUserName.placeholder,
        email: editEmail.value? editEmail.value : editEmail.placeholder
    }

    updateMe(changeData);
    
}

submitEditBtn.addEventListener('click', async function(e){

    e.preventDefault();
    if(!editUserName.value && !editEmail.value){
        popupMessage('Enter some changes to be submited :)');
    }

    
    await getChangeNameEmail();
    init();
    

   

})





////////////////////////////////////////////////////// chane password form validation ///////////////////////





////////////////////////////////////////////////////////// delete my account ////////////////////////////////


deleteAcc.addEventListener('click',()=>{
    document.querySelector('.popup-overlay-deleteAcc').classList.remove('hidden');
    document.querySelector('.popup-overlay-deleteAcc').addEventListener('click',function(e){
        if(e.target.classList.contains('popup-overlay-deleteAcc')){
            document.querySelector('.popup-overlay-deleteAcc').classList.add('hidden');
        }
    });

    document.getElementById('cancel-delete-acc').addEventListener('click',function(){
        document.querySelector('.popup-overlay-deleteAcc').classList.add('hidden');
    });

    document.getElementById('confirm-delete-acc').addEventListener('click',function(){
        deleteMe();
        localStorage.clear();
        window.location = '../../index.html';
    });
    
});

////////////////////////////////////////////////////////// update my password ////////////////////////////////


const updatePassBody = function(){
    const data ={
        passwordCurrent: oldPassword.value,
        password: newPassword.value,
        passwordConfirm: confirmPassword.value
    }

    const  result = updatePassword(data);
}

changePassFormBtn.addEventListener('click',updatePassBody);


///////////////////////////////////////////////////// change bio ///////////////////////////////////////
openChngBioBtn.addEventListener('click',function(){
    popupOverlayBio.classList.remove('hidden');
    popupOverlayBio.addEventListener('click',function(e) {
        if(e.target.classList.contains('popup-overlay'))
            popupOverlayBio.classList.add('hidden');
    });
    document.getElementById('bio').placeholder = JSON.parse(localStorage.getItem('user-data')).bio;
});

const changeBio = async function(){
    const bioVal = document.getElementById('bio').value;
    //console.log(bioVal.replace(/\s+/g,'').length);
    // console.log(bioVal.trim().length);
    if(bioVal.length > 150 ){
        popupMessage(`Bio Can't Be More Than 150 Characters!`)
    }

    else{ 
    //console.log(bioVal.replace(/\s+/g,'').length);
    const bioData = {
        "bio": bioVal.trim()
        }

    document.getElementById('bio').value = '';
    await updateMe(bioData);
}

}


document.getElementById('change-bio').addEventListener('click',function(){
    popupOverlayBio.classList.add('hidden');
    changeBio();
    
});