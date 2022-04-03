


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


function formatAMPM(date) {

    var hours = date.getHours()-2;
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

export const getDate = (date) => {
    let dateObj = new Date(date);
    // date: dateObj.toDateString(),
    // time: formatAMPM(dateObj)
    return `${dateObj.toDateString()} at ${formatAMPM(dateObj)}`
}