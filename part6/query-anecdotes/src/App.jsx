import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import {useQuery,useQueryClient, useMutation} from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './request'

const App = () => {
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: false,
   
  })
  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(anecdote =>
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      ))
    }
  })
  console.log(JSON.parse(JSON.stringify(result)))
  if ( result.isLoading){
    return <div> loading data ...</div>
  }



  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  

  const handleVote = (anecdote) => {
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    voteMutation.mutate(updatedAnecdote)
  }
  console.log("result:",result.data)

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
