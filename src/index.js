import './css/styles.css';

import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import someTemplateCard from './templates/country-full-card.hbs';
import someTemplate from './templates/country-card.hbs';
import { fetchCountries } from './fetchCountries';

const inputEl = document.querySelector('#search-box');
const ulEl = document.querySelector('.country-list');
const divEl = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

const handleSearchCountry = event => {
  event.preventDefault();
  const searchCountry = event.target.value.trim();
  fetchCountries(searchCountry)
    .then(data => {
      console.log(data);
      ulEl.innerHTML = '';
      divEl.innerHTML = '';
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (data.length === 1) {
        const arrayLanguages = Array.from(
          Object.values(data[0].languages)
        ).join(', ');
        data[0].valueLanguages = arrayLanguages;

        divEl.insertAdjacentHTML('beforeend', someTemplateCard(...data));
      } else {
        data.map(el => ulEl.insertAdjacentHTML('beforeend', someTemplate(el)));
      }
    })
    .catch(error => {
      console.log(error);
      Notiflix.Report.failure('Oops, there is no country with that name');
    });
};
inputEl.addEventListener(
  'input',
  debounce(handleSearchCountry, DEBOUNCE_DELAY)
);
