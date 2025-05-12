import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {useField, useCountry} from './hooks/index'


const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return <div>not found...</div>
  }

  const data = country.data

  return (
    <div>
      <h3>{data.name.common}</h3>
      <div>capital {data.capital[0]}</div>
      <div>population {data.population}</div>
      <img src={data.flags.png} height='100' alt={`flag of ${data.name.common}`} />
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App