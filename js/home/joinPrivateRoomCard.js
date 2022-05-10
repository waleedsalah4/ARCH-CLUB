export const addJoinPrivateRoom = (container) => {
    container.innerHTML = '';
    const markup = `
    <form class="join-private-room" id="join-private-room">
        <div class="room-id">
            <input type="text" id="get-id" placeholder="Enter room id">
        </div>
        <div class="room-id">
            <input type="submit" value="join" class="join-private">
        </div>
    </form>
    `
    container.innerHTML = markup;
    document.querySelector('#join-private-room').addEventListener('submit', (e)=>{
        e.preventDefault();
        if(document.querySelector('#get-id').value.length > 0) {
            window.location = `../rooms/room.html?id=${document.querySelector('#get-id').value}`
        } else{
            snackbar(document.getElementById('snackbar-container'),'error', `<b>Error: </b> please enter valid id`, 5000);
        }
    })

}