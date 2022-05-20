import { searchForPodcast } from "../utilities/requests.js";
let podcastContainer = document.querySelector('.podcasts-veiw-container')

const searchBox = document.querySelector('#search-podcast')
const searchIcon = document.querySelector('#search-input-icon')
// console.log(searchBox)
// let loadmore = document.querySelector('.load-more')
// let categorieLoadMore = document.querySelector('.load-more-category')

searchBox.addEventListener('keyup', (e) => {
    if (e.keyCode == 13){
        if(searchBox.value) {
            clearAnyLoadMore()
            podcastContainer.innerHTML = ''
            searchForPodcast(podcastContainer,searchBox.value)
        } 
    }
})

searchIcon.addEventListener('click', () => {
    if(searchBox.value) {
        clearAnyLoadMore()
        podcastContainer.innerHTML = ''
        searchForPodcast(podcastContainer,searchBox.value)
    } 
})

const clearAnyLoadMore = () => {
    let loadmore = document.querySelector('.load-more')
    let categorieLoadMore = document.querySelector('.load-more-category')
    console.log(categorieLoadMore)
    if(categorieLoadMore){
        console.log('categorieLoadMore cleared')
        categorieLoadMore.parentElement.removeChild(categorieLoadMore)
    } else {
        console.log('categorieLoadMore not cleared')
    }
    console.log(loadmore)
    if(loadmore){
        console.log('loadmore cleared')
        loadmore.parentElement.removeChild(loadmore)
    } else {
        console.log('loadmore not cleared')
    }
}