import { useState } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useMatch
} from "react-router-dom"

import { useField } from './hooks'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link style={padding} to='/'>anecdotes</Link>
      <Link style={padding} to='/create'>create new</Link>
      <Link style={padding} to='/about'>about</Link>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote =>
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>)}
    </ul>
  </div>
)

const Anecdote = ({ anecdote }) => {
  if (!anecdote) {
    return <p>Anecdote not found</p>
  }

  return (
    <div>
      <h1>{anecdote.content} by {anecdote.author}</h1>
      <p>has {anecdote.votes} votes</p>
      <p>for more info see <a href={anecdote.info} target="_blank" rel="noreferrer">{anecdote.info}</a></p>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    <em>An anecdote is a brief, revealing account of an individual person or an incident...</em>
    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.
    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>source code</a>.
  </div>
)

const CreateNew = ({ addNew }) => {
  const content = useField('text')
  const author =useField('text')
  const info = useField('text')
  const navigate = useNavigate()


    // Destructure reset from each hook to avoid passing it to <input />
  const { reset: resetContent, ...contentInput } = content;
  const { reset: resetAuthor, ...authorInput } = author;
  const { reset: resetInfo, ...infoInput } = info;

  const handleSubmit = (e) => {
    e.preventDefault()
    addNew({
  content: content.value,
  author: author.value,
  info: info.value,
  votes: 0
})
    navigate('/') 

  }

    const handleReset = (e) => {
    e.preventDefault(); // prevents page reload
    resetContent();
    resetAuthor();
    resetInfo();
  };


  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentInput} />
        </div>
        <div>
          author
          <input {...authorInput}/>
        </div>
        <div>
          url for more info
          <input {...infoInput} />
        </div>
        <button type='submit'>create</button>
        <button type="button" onClick={handleReset}>reset</button>

      </form>
    </div>
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')
  const match = useMatch('/anecdotes/:id')
  const anecdote = match ? anecdotes.find(a => a.id === Number(match.params.id)) : null

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))

    setNotification(`A new anecdote '${anecdote.content}' created!`)
    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      {notification && <div style={{ border: '1px solid green', padding: 10, marginBottom: 10 }}>{notification}</div>}
      <Routes>
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote} />} />
        <Route path="/create" element={<CreateNew addNew={addNew} />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
