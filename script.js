///////////////////////////////////////////////////////////
//////////////////////DISPLAY COUNTRY APPLICATION///////////////////////

'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');


const rendererror = msg => {
    countriesContainer.insertAdjacentText('beforeend', msg);
    // countriesContainer.style.opacity = 1;
}
const rendercountry = (data, className = '') => {
    const html = `<article class="country ${className}">
        <img class="country__img" src="${data.flag}" />
        <div class="country__data">
          <h3 class="country__name">${data.name}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${(+data.population / 100000).toFixed(1)}</p>
          <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
          <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
        </div>
      </article>`;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
}
const getposition = () => {
    return new Promise((resolve, reject) => {
        // navigator.geolocation.getCurrentPosition(position => {
        //     resolve(position);
        //     err => reject(err);
        // })
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};

getposition().then(pos => console.log(pos));

const whereAmI = () => {
    getposition().then(pos => {
        const { latitude: lat, longitude: lng } = pos.coords;

        return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    }).then(res => {
        if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
        return res.json();
    })
        .then(data => {
            console.log(data);
            console.log(`You are in ${data.city}, ${data.country}`);

            return fetch(`https://restcountries.com/v2/name/${data.country}`);
        })
        .then(res => {
            if (!res.ok) throw new Error(`Country not found (${res.status})`);

            return res.json();
        })
        .then(data => rendercountry(data[0]))
        .catch(err => console.error(`${err.message}`));
};

btn.addEventListener('click', whereAmI);