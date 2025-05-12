import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name/'

const getAll = (name) => {
  return axios.get(baseUrl + name).then(response => response.data)
}

export { getAll }
