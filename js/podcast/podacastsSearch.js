import { searchForPodcast } from "../utilities/requests.js";
let podcastContainer = document.querySelector('.podcasts-veiw-container')

const searchBox = document.querySelector('#search-podcast')
const searchIcon = document.querySelector('#search-input-icon')
// console.log(searchBox)

searchBox.addEventListener('keyup', (e) => {
    if (e.keyCode == 13){
        if(searchBox.value) {
            podcastContainer.innerHTML = ''
            searchForPodcast(podcastContainer,searchBox.value)
        } 
    }
})

searchIcon.addEventListener('click', () => {
    if(searchBox.value) {
        podcastContainer.innerHTML = ''
        searchForPodcast(podcastContainer,searchBox.value)
    } 
})