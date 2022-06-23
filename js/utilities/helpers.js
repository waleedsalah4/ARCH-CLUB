


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

    var hours = date.getHours();
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


export const todayDate = () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();

    if (dd < 10) { dd = '0' + dd; }
    if (mm < 10) { mm = '0' + mm;} 
        
    let date = yyyy + '-' + mm + '-' + dd;
    return date
}

export const dateAfterTwoWeeks = () => {
    let twoWeeks = 1000 * 60 * 60 * 24 * 13;
    let twoWeeksTime = new Date(new Date().getTime() + twoWeeks);
    let d = twoWeeksTime.getDate();
    let m = twoWeeksTime.getMonth() + 1;
    let y = twoWeeksTime.getFullYear();
    if (d < 10) { d = '0' + d; }
    if (m < 10) { m = '0' + m;}
    let formattedDate = y + '-' + m + '-' + d ;

   return formattedDate
}

export const popupCancel = function(MainClass,e){
    if(e.target.classList.contains(`${MainClass}`)){
        document.querySelector(`.${MainClass}`).classList.add('hidden');
    }
}

