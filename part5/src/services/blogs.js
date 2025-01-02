import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/blogs'

let token = null;

const getAll = () => {
  const config = {
    headers: { Authorization : token},
  }
  const request = axios.get(baseUrl, config)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const setToken = newToken =>{
  token = `Bearer ${newToken}`
}
const update = async (id, updatedBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config);
  return response.data;
};
const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
}
export default { getAll, setToken, create, update, remove }