export function snackbar(snackbarContainer,type, msg, time){
    const para = document.createElement('P');
    para.classList.add('snackbar');
    para.innerHTML = `${msg} <span> &times </span>`;

    if(type === 'error'){
        para.classList.add('error');
    }
    else if(type ==='success'){
        para.classList.add('success');
    }
    else if(type ==='warning'){
        para.classList.add('warning');
    }
    else if(type ==='info'){
        para.classList.add('info');
    }

    snackbarContainer.appendChild(para);
    para.classList.add('fadeout');

    setTimeout(()=>{
            snackbarContainer.removeChild(para)
    }, time)

}