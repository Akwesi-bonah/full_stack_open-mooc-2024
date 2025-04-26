import { useDispatch } from 'react-redux';
import { createNewAnecdote } from '../reducers/anecdoteReducer';
import anecdotesService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    const newAnecdote = anecdotesService.createNew(content)
    dispatch(createNewAnecdote(newAnecdote));
  };

  return (
    <form onSubmit={addAnecdote}>
      <h2>Create New </h2>
      <input name="anecdote" />
      <button type="submit">Add</button>
    </form>
  );
};

export default AnecdoteForm;
