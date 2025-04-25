import { useDispatch, useSelector } from "react-redux";
import {voteAnecdote,selectSortedAnecdotes } from "../reducers/anecdoteReducer";
import { showNotification } from "../reducers/notificationReducer";

const Anecdote = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(selectSortedAnecdotes);

 const handleVote = (id, content) => {
    dispatch(voteAnecdote(id));
    dispatch(showNotification(`you voted '${content}'`, 5));
  };
  return (
    <div>
     
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Anecdote;
