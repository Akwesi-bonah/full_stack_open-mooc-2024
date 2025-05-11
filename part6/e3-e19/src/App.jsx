import AnecdoteForm from './components/AnecdoteForm';
import AnecdoteList from  './components/AnecdoteList'
import Notification from './components/Notification';
import Filter from './components/Filter';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import anecdotesService from './services/anecdotes';
import { setAnecdote} from './reducers/anecdoteReducer'
const App = () => {
  const dispatch = useDispatch()
  useEffect(()=>{
    anecdotesService.getAll().then(
      anecdotes => dispatch(setAnecdote(anecdotes))
    )
  }, [])
  

  return (
    <div>
      <Notification></Notification>
       <h2>Anecdotes</h2>
        <Filter></Filter>
      <AnecdoteList></AnecdoteList>
      <AnecdoteForm></AnecdoteForm>
    </div>
  )
}

export default App