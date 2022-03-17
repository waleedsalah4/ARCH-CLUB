
const bar = document.querySelector('.sideBar');
const barIcons = document.querySelectorAll('.bar-icons');
const barIcon = document.querySelector('.bar-icon');
const barLinks = document.querySelectorAll('.sideBar ul .bar-item');

const toggleIcon = document.querySelector('.bar-icon-container') 



//event handlers

//1)open and close side bar functionality
toggleIcon.addEventListener('click',function(e){
    // if((e.target.matches('svg') || e.target.matches('path') )&& e.target.classList.contains('bar-icon')){ 
    //     
    // }
    bar.classList.toggle('opened');

    if(!bar.classList.contains('opened')){
        barLinks.forEach(ln=>ln.classList.remove('highlight')) ;
        const active = Array(...barLinks).filter(ln=> ln.classList.contains('active'))[0];
        active.classList.toggle('highlight');
    }

    else{
        barLinks.forEach(ln=>ln.classList.remove('highlight')) ;
    }
    
});


//5) active side bar option

barLinks.forEach(link=>{
    link.addEventListener('click',function(e){
        barLinks.forEach(ln=> ln.classList.remove('active'));
        e.target.closest('.bar-item').classList.add('active');
       
    
    });
});