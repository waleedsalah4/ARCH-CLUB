'use strict';

//elements
const bar = document.querySelector('.sideBar');
const barIcons = document.querySelectorAll('.bar-icons');
const barIcon = document.querySelector('.bar-icon');
const info = document.querySelector('.info');
const infoContent = document.querySelectorAll('.info span');
const btnFollowProfile = document.querySelector('.follow-following');
const podcastContent = document.querySelector('.podcast-content');
const podcastComponentHeading = document.querySelector('.podcast-component-heading');
const hideDisplaySide = ['podcast-content','followers-content' ,'following-content'];
const barLinks = document.querySelectorAll('.sideBar ul .bar-item');
const generalBtn = document.querySelectorAll('.cBtn');
const tempUserName = 'Will Smith';
///////////////////////////////////////////////////////////////////////////////////////////////////

//event handlers

//1)open and close side bar functionality
bar.addEventListener('click',function(e){
    if((e.target.matches('svg') || e.target.matches('path') )&& e.target.classList.contains('bar-icon')){ 
        bar.classList.toggle('opened');
    }

    if(!bar.classList.contains('opened')){
        barLinks.forEach(ln=>ln.classList.remove('highlight')) ;
        const active = Array(...barLinks).filter(ln=> ln.classList.contains('active'))[0];
        active.classList.toggle('highlight');
    }

    else{
        barLinks.forEach(ln=>ln.classList.remove('highlight')) ;
    }
    
});


//2)active link (podcast , followers , following) and show its content
info.addEventListener('click',function(e){
    
    if(e.target.matches('span') ){
        
        //1) mark target as active
        infoContent.forEach(el=> el.classList.remove('active'));
        e.target.classList.add('active');


        //2) show side content
           // hideDisplaySide.forEach(el=> el.classList.add('hidden'))
            hideDisplaySide.forEach(el=> {
                document.querySelector(`.${el}`).classList.add('hidden');
            })
            //1) if podcasts
            if(e.target.classList.contains('podcasts')) {
                //change heading

                podcastComponentHeading.innerHTML = `
                ${tempUserName.split(" ")[0]}'s Podcasts
                <button class="add-podcast-btn">
                        <i class="fa-solid fa-circle-plus fs-3 me-4"></i>
                        Add podcast
                    </button>
                    `;

                document.querySelector(`.${hideDisplaySide[0]}`).classList.remove('hidden');
            }

            //2) if followers
            if(e.target.classList.contains('followers')) {
                //change heading
                podcastComponentHeading.textContent = `${tempUserName.split(" ")[0]}'s Followers`;
                document.querySelector(`.${hideDisplaySide[1]}`).classList.remove('hidden');
            }

            //3)if following
            if(e.target.classList.contains('following')) {
                //change heading
                podcastComponentHeading.textContent = `${tempUserName.split(" ")[0]}'s Following`;
                document.querySelector(`.${hideDisplaySide[2]}`).classList.remove('hidden');
            }

    }
});


//3)changing the follow btn into following
btnFollowProfile.addEventListener('click',function(){

    if(btnFollowProfile.classList.contains('btn-follow-profile')){ 

        //1)change btn ui
        btnFollowProfile.classList.remove('btn-follow-profile');
        btnFollowProfile.classList.add('btn-following-profile');
        btnFollowProfile.textContent = 'Following';

        //2)add user as following

    }

    else{

        //1) change btn ui
        btnFollowProfile.classList.remove('btn-following-profile');
        btnFollowProfile.classList.add('btn-follow-profile');
        btnFollowProfile.textContent = 'Follow';
       

        //2) remove user from following 

    }

});


//4) follow-following general
generalBtn.forEach(btn=> {
    btn.addEventListener('click',()=>{
        if(btn.classList.contains('follow-btn')){
            btn.textContent = "Following";
            btn.classList.remove('follow-btn');
            btn.classList.add('following-btn');
        }
    
        else{
            btn.textContent = "Follow";
            btn.classList.remove('following-btn');
            btn.classList.add('follow-btn');
        }
    })
});

//5) active side bar option

barLinks.forEach(link=>{
    link.addEventListener('click',function(e){
        barLinks.forEach(ln=> ln.classList.remove('active'));
        e.target.closest('.bar-item').classList.add('active');
       
    
    });
});