export const roomCard = (room, container) => {
    const markup = `
    <div class="room">
        <div class="room-card">
            <div class="room-title">
                <div>
                    <span class="room-name">${room.name}</span>
                    <span class="room-category">${room.category}</span>
                </div>
                <div>
                    <a href="../rooms/room.html?id=${room._id}" target="_blank" class="join-public-room">Join</a>
                </div>
            </div>
            <div class="room-info">
                <div class="people">
                    <img class="user-img" src="${room.admin.photo}" title="${room.admin.name} (host)">
                    ${room.brodcasters[0] ? `<img class="user-img" title="${room.brodcasters[0].name}" src="${room.brodcasters[0].photo}">` : ''}
                    ${room.brodcasters[1] ? `<img class="user-img" title="${room.brodcasters[1].name}" src="${room.brodcasters[1].photo}">` : ''}
                </div>
                <div class="speakers">
                    <span class="speakers-count">${room.brodcasters.length + 1}</span>
                    <span class="speakers-text">Speakers</span>
                </div>
                <div class="listeners">
                    <span class="listeners-count">${room.audience.length}</span>
                    <span class="listeners-text">listeners</span>
                </div>
            </div>
        </div>
    </div>
    `;

    container.insertAdjacentHTML('beforeend', markup)
}