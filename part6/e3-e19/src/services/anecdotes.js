import axios from 'axios'
const baseUrl = 'http://localhost:3001/anecdotes'


const getAll = async () =>{
    const response = await axios.get(baseUrl)
    console.log(response)
    return response.data
}

const createNew = async (content) =>{
    const object = {
        content,
        votes: 0
    }

    const response = await axios.post(baseUrl, object)
    console.log("Data", response.data)
    return response.data
}

const update = async (id, updatedAnecdote) => {
    const response = await axios.put(`${baseUrl}/${id}`, updatedAnecdote)
    return response.data
  }


export default {getAll, createNew, update}