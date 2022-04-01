import { loadSpinner, clearLoader } from './loader.js';
import { homeSideBarHref } from './sideBar/sideBarHref.js';
import { sideBarView } from './sideBar/sideBarView.js';
import { getCategories } from './utilities/getCategory.js';

const homeSideBar = document.querySelector('#home-sideBar')
// const sidebar = document.querySelector('.nav')
// const toggle = document.querySelector("#toggle");
const categoryContainer = document.querySelector('.category')

let categoreisButtons = [];
//const searchBtn = document.querySelector(".search-box"),
//const modeSwitch = document.querySelector(".toggle-switch"),
//const modeText = document.querySelector(".mode-text");



//load category

const addAllCatgorydiv = () => {
    const markup = `
    <div class="categorie-component active">All</div>
    `
    categoryContainer.insertAdjacentHTML('beforeend', markup)
}

const categoryItems = (catItem) => {
    const markup = `
        <div class="categorie-component">${catItem.name}</div>
    `;
    categoryContainer.insertAdjacentHTML('beforeend', markup)
}

const createCategory = async() => {
    loadSpinner(categoryContainer);

    const cat = await getCategories();
    
    clearLoader();
    addAllCatgorydiv();
    cat.map(c=> categoryItems(c))

    categoreisButtons= Array.from(document.querySelectorAll('.categorie-component'))
    // console.log(categoreisButtons)

// button actions
    for(let i=0; i<categoreisButtons.length; i++){
        categoreisButtons[i].onclick = function(){
            removeAllCtegorActive();

            categoreisButtons[i].classList.add('active')
            console.log(categoreisButtons[i].textContent)
        }
    }
}
createCategory();







 


function removeAllCtegorActive() {
    categoreisButtons.forEach(btn =>
        btn.classList.remove('active')
    );
}



window.addEventListener('load', ()=> {
    sideBarView(homeSideBarHref,homeSideBar)
})

//events
// toggle.addEventListener("click" , () =>{
//     sidebar.classList.toggle("close");
// })


// searchBtn.addEventListener("click" , () =>{
//     sidebar.classList.remove("close");
// })
/*
modeSwitch.addEventListener("click" , () =>{
    body.classList.toggle("dark");
    
    if(body.classList.contains("dark")){
        modeText.innerText = "Light mode";
    }else{
        modeText.innerText = "Dark mode";
        
    }
});*/