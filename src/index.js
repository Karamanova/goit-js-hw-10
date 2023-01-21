import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

import { fetchCountries } from './js/fetchCountries';
import { previewMarkup, createMarkup } from './js/markup';

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
const DEBOUNCE_DELAY = 300;

function clearMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

let inputValue = '';

function renderPrewiewMarkup(array) {
  const markup = array.map(previewMarkup).join('');
  refs.countryList.innerHTML = markup;
}

function renderCountryMarkup(array) {
  const markup = array.map(createMarkup).join('');
  refs.countryInfo.innerHTML = markup;
}

function onInputChange(evt) {
  clearMarkup();
  inputValue = evt.target.value.trim().toLowerCase();

  if (!inputValue) {
    return;
  }
  fetchCountries(inputValue)
    .then(array => {
      if (array.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
      } else if (array.length > 1 && array.length <= 10) {
        Notify.info(`Hooray! We found ${array.length} countries.`);
        renderPrewiewMarkup(array);
      } else if (array.length === 1) {
        Notify.success(`This is exactly what you were looking for!`);
        renderCountryMarkup(array);
      }
    })
    .catch(error => {
      catchError(error);
    });
}

function catchError() {
  Notify.failure('Oops, there is no country with that name');
  clearMarkup();
}

refs.input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));
