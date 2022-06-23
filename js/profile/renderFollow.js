export const renderFollow = (data, container) => {
    // console.log(data)
    const markup = `
    <div class="follow-item"> 
        <div class="follow-img">
            <img src="${data.following.photo}" alt="user photo">
        </div>
        <p> 
            <a class="userLink" href="./index.html?id=${data.following._id}"> ${data.following.name}<a/>
            <br> 
            <span>${data.following.followers ? data.following.followers : 0} ${data.following.followers==1? 'Follower': 'Followers'}</span> 
        </p>
    </div>
                             
    `;

    container.insertAdjacentHTML('beforeend', markup)
}


export const renderFollowers = (data, container) => {
    // console.log(data)
    const markup = `
    <div class="follow-item"> 
        <div class="follow-img">
            <img src="${data.follower.photo}" alt="user photo">
        </div>
        <div>
            <p> 
                <a class="userLink" href="./index.html?id=${data.follower._id}"> ${data.follower.name}<a/>
                <br> 
                <span>${data.follower.followers ? data.follower.followers : 0} ${data.follower.followers==1? 'Follower': 'Followers'}</span> 
            </p>
        </div>
    </div>
                             
    `;

    container.insertAdjacentHTML('beforeend', markup)
}