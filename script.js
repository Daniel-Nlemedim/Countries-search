'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const searchField = document.querySelector('.search')

const renderCountry = function (data, className = '') {
  const html = `
        <article class="country ${className}">
              <img class="country__img" src="${data.flag}" />
              <div class="country__data">
                <h3 class="country__name">${data.name}</h3>
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><people>👫${(
                  +data.population / 1000000
                ).toFixed(1)} people</p>
                <p class="country__row"><span>🗣️${
                  data.languages[0].name
                }</span></p>
                <p class="country__row"><span>💰${
                  data.currencies[0].name
                }</span></p>
              </div>
            </article>
        `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};

//render error
const renderError = function (msg) {
  countriesContainer.insertAdjacentText(`beforeend`, msg);
  countriesContainer.style. paddingBottom = `10px`
  // countriesContainer.style.opacity = 1;
};

//fetch API and promises
const getCountryData = function (country) {
  //country1
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(response => {
      console.log(response)
      if(!response.ok)
        throw new Error(`Country not found (${response.status})`)
    return  response.json()
    })
    .then(data => {
      renderCountry(data[0]);
      const neighbor = data[0].borders?.[0];

      if (!neighbor) return;

      //country2
      return fetch(`https://restcountries.com/v2/alpha/${neighbor}`);
    })
    .then(response => response.json())
    .then(data => {
      renderCountry(data, 'neighbor');
      const neighbor2 = data.borders?.[1];

      if (!neighbor2) return;
      
    })
    // .catch(err => {
    // //   renderError(`Something went wrong ${err.message}.Try again!`);
    // })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

searchField.addEventListener('keypress', function (e) {
  console.log(e.key);
  
  if (e.key === 'Enter') {
    e.preventDefault();
    renderError(``);
    countriesContainer.innerHTML = '';
    const country = searchField.value;
    getCountryData(country);
    searchField.value = '';
  }
});

