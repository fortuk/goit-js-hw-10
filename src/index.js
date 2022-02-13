import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

// Импортируем функцию из fetchCountries.js

import { fetchCountries } from './js/fetchCountries';

// Переменные для разметки

const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// Вешаем debounce

const DEBOUNCE_DELAY = 300;

countryInput.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

// Функция при инпуте

function onCountryInput() {
  // Тримим введенную строку что бы избавится от проблемы пробелов

  const name = countryInput.value.trim();
  if (name === '') {
    return (countryList.innerHTML = ''), (countryInfo.innerHTML = '');
  }

  // Вызываем функцию из fetchCountries.js

  fetchCountries(name)
    .then(country => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';

      // Если найдена 1 страна - отрисовываем детально, если от 2 до 10 - выводим список стран, если больше - выводим сообщение "Слишком много совпадений"

      if (country.length === 1) {
        countryInfo.insertAdjacentHTML('beforeend', markupCountryInfo(country));
      } else if (country.length >= 10) {
        ifTooManyMatchesAlert();
      } else {
        countryList.insertAdjacentHTML('beforeend', markupCountryList(country));
      }
    })
    //   Ловим ошибку при вводе
    .catch(ifWrongNameAlert);
}

// Функция для вывода алерта, если больше 10 совпадений

function ifTooManyMatchesAlert() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}

// Функция для вывода алерта, если есть ошибка при вводе

function ifWrongNameAlert() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

// Отрисовка списка стран

function markupCountryList(country) {
  const layoutCountryList = country
    .map(({ name, flags }) => {
      const layout = `
          <li class="country-list__item">
              <img class="country-list__item--flag" src="${flags.svg}" alt="Flag of ${name.official}">
              <h2 class="country-list__item--name">${name.official}</h2>
          </li>
          `;
      return layout;
    })
    .join('');
  return layoutCountryList;
}

// Детальная информация о стране, если совпадение только одно

function markupCountryInfo(country) {
  const layoutCountryInfo = country
    .map(({ name, flags, capital, population, languages }) => {
      const layout = `
        <ul class="country-info__list">
            <li class="country-info__item">
              <img class="country-info__item--flag" src="${flags.svg}" alt="Flag of ${
        name.official
      }">
              <h2 class="country-info__item--name">${name.official}</h2>
            </li>
            <li class="country-info__item"><span class="country-info__item--categories">Capital: </span>${capital}</li>
            <li class="country-info__item"><span class="country-info__item--categories">Population: </span>${population}</li>
            <li class="country-info__item"><span class="country-info__item--categories">Languages: </span>${Object.values(
              languages,
            ).join(', ')}</li>
        </ul>
        `;
      return layout;
    })
    .join('');
  return layoutCountryInfo;
}
