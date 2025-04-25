import { useDispatch } from 'react-redux';
import { createNewAnecdote } from '../reducers/anecdoteReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    dispatch(createNewAnecdote(content));
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
