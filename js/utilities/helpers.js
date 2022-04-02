


export const logout = function(){
    localStorage.clear();
    window.location = '../sign/signin.html';
}

export const popupMessage = function(msg,time=3000){
    let overlay = document.createElement('div');
    overlay.classList.add('popup-overlay');
    document.body.appendChild(overlay)

    let popupBox = document.createElement('div');
    popupBox.classList.add('popup-box');
    
    let message = document.createElement('p');
    message.innerHTML = msg;
    message.classList.add('popup-message');

    popupBox.appendChild(message);
    overlay.appendChild(popupBox);


    setTimeout(function(){
        overlay.classList.add('hidden');
    },time);
}