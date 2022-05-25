export const sideBarView = (hrefObject, container) => {
    const markup = `
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
            <a class="nav-link li-item" href="${hrefObject.discover}">
                <div>Discover</div>
                <div>
                    <i class="fa-solid fa-circle-chevron-down bar-icons "></i>
                </div>
            </a>
            
        </li>
        <li class="nav-item ">
            <a class="nav-link li-item" href="${hrefObject.podcasts}">
                <div>Podcasts</div>
                <div>
                    <i class="fa-solid fa-circle-chevron-down bar-icons "></i>
                </div>
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link li-item" href="${hrefObject.events}">
                <div>Events</div>
                <div>
                    <i class="fa-solid fa-calendar"></i>
                </div>
            </a>
        </li>
    </ul>
    <div class="d-flex">
        <ul class="navbar-nav d-flex align-items-center">
            <li class="nav-item">
                <a class="nav-link" href="${hrefObject.profile}">
                <img  src="${JSON.parse(localStorage.getItem('user-data')).photo}" alt="user profile picture" class="navbar-pf-img">
                </a>
            </li>
            <li class="nav-item">
                <button type="button" class="btn btn-dark li-item" id="logout-btn">
                   <div>Logout</div>
                    <div>
                        <i class="fa-solid fa-right-from-bracket"></i>
                    </div>
                </button>  
                
            </li>
        </ul>
    </div>
    `
    container.insertAdjacentHTML('beforeend', markup)

    document.querySelector('#logout-btn').addEventListener('click', ()=> {
        localStorage.clear();
        window.location = `${hrefObject.logout}`;
    })
}