import { uploadPhoto ,getMe} from "../utilities/profileReq.js";

const changePhoto = document.querySelector('.change');
const file = document.getElementById('photo-file');
let photo = '';
const currentPhoto = document.querySelector('.user-photo');


file.addEventListener('change',function(){
    
    photo = file.files[0];
    let path = '';
    const reader = new FileReader();
    reader.addEventListener('load',()=>{
        path = reader.result;
        
        currentPhoto.src = path;
    });

    reader.readAsDataURL(file.files[0]); 
});


changePhoto.addEventListener('click',async function(){
    const photoData = new FormData;
    photoData.append("photo",photo);
    await uploadPhoto(photoData);
    init();

});















const init = async function(){
    await getMe();
    currentPhoto.src = JSON.parse(localStorage.getItem('user-data')).photo;
}
init();
