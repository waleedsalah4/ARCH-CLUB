let bar;
let barIcons;
let barIcon;
let barLinks;

let toggleIcon;

export const sideBarView = (hrefObject, container) => {
    const markup = `
    <div class="top">
        <div class="logo">Logo</div>
        <div class="bar-icon-container"> 
            <i class="fa-solid fa-bars bar-icon   appear"></i> 
        </div>
    </div>

    <ul class="nav" >
        <li class="navbar-item bar-item active highlight">
            <a href="${hrefObject.home}">
                <i class="fa-solid fa-house bar-icons"></i>
                <h3>Home</h3>
            </a>
        </li>

        <li class="navbar-item bar-item">
            <a href="${hrefObject.discover}">
                <i class="fa-solid fa-circle-chevron-down bar-icons "></i>
                <h3>Discover</h3>
            </a>
        </li>

        <li class="navbar-item bar-item">
            <a href="${hrefObject.podcasts}">
                <i class="fa-solid fa-video bar-icons "></i>
                <h3>My Podcasts</h3>
            </a>
        <!--  <i class="fa-solid fa-circle-plus  "></i>-->
        </li>

        <li class="navbar-item bar-item">
            <a href="${hrefObject.events}">
                <i class="fa-solid fa-calendar bar-icons"></i>
                <h3>Events</h3>
            </a>
        </li>

        <li class="navbar-item bar-item">
            <a href="${hrefObject.profile}">
                <i class="fa-solid fa-user bar-icons "></i>
                <h3>Profile</h3>
            </a>
        </li>

        <li class="navbar-item bar-item" id="logout-btn">
            <i class="fa-solid fa-arrow-right-from-bracket bar-icons "></i>
            <h3>LogOut</h3>
        </li>
    </ul>
    
    `

    container.insertAdjacentHTML('beforeend', markup)

    bar = document.querySelector('.sideBar');
    barIcons = document.querySelectorAll('.bar-icons');
    barIcon = document.querySelector('.bar-icon');
    barLinks = document.querySelectorAll('.sideBar ul .bar-item');

    toggleIcon = document.querySelector('.bar-icon-container') 


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

    document.querySelector('#logout-btn').addEventListener('click', ()=> {
        window.location = `${hrefObject.logout}`;
    })
}