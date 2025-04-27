import { createAnecdotes } from "../request"
import { useMutation, useQueryClient } from '@tanstack/react-query'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
      mutationFn: createAnecdotes,
      onSuccess: (newAnecdote) =>{
        const anecdotes = queryClient.getQueryData(['anecdotes'])
        queryClient.setQueryData(['anecdotes'], anecdotes.concat(newNote))
      }
    })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote', content)

    if (content.length < 5) {
      console.log('anecdote too short, must be at least 5 characters')
      return
    }

    newAnecdoteMutation.mutate({
      content,
      votes: 0  
    })
  }

  

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
