import { createSlice } from '@reduxjs/toolkit'
import anecdotesService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(a => a.id === id)
      if (anecdoteToChange) {
        anecdoteToChange.votes += 1
      }
    },
    setAnecdote(state, action){
      return action.payload
    },
    appendAnecdote(state, action){
      return state.push(action.payload)
    }
  }
})

// Selector: filter and sort by votes
export const selectSortedAnecdotes = (state) => {
  const filtered = state.anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
  )
  return [...filtered].sort((a, b) => b.votes - a.votes)
}


export const initializeAnecdotes = () =>{
  return async dispatch =>{
    const anecdotes = await anecdotesService.getAll()
    dispatch(setAnecdote(anecdotes))
  }
}
export const createNewAnecdote = content =>{
  return async dispatch =>{
    const newAnecdote = await anecdotesService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const createVote = (id) => {
  return async (dispatch, getState) => {
    const anecdoteToVote = getState().anecdotes.find(a => a.id === id)
    const updatedAnecdote = {
      ...anecdoteToVote,
      votes: anecdoteToVote.votes + 1
    }

    await anecdotesService.update(id, updatedAnecdote) 
    dispatch(voteAnecdote(id)) 
  }
}
// Export actions and reducer
export const { voteAnecdote, setAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer
