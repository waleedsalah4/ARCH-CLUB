//when request is succuess but response has no data
export const ZeroData = (container, message) => {
    const markup = `
        <div class="end-of-data">
            ${message}
        </div>
    `
    container.insertAdjacentHTML('beforeend', markup)
}