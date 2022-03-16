const elementString = {
    loader: 'spinner',
  };
  
  export function loadSpinner(parentElement) {
    const loader = `
        <div class="${elementString.loader}"></div>
        `;
    parentElement.insertAdjacentHTML('afterbegin', loader);
  }
  
  export const clearLoader = () => {
    const loader = document.querySelector(`.${elementString.loader}`);
    if (loader) loader.parentElement.removeChild(loader);
  };