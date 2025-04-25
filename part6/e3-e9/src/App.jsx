import AnecdoteForm from './components/AnecdoteForm';
import AnecdoteList from  './components/AnecdoteList'
import Notification from './components/Notification';
import Filter from './components/Filter';


const App = () => {

  

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