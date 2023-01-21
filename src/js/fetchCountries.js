const url = `https://restcountries.com/v3.1/name/`;
const settings = '?fields=name,capital,population,languages,flags';

export function fetchCountries(name) {
  return fetch(`${url}${name}${settings}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
