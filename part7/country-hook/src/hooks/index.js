import { useState, useEffect } from 'react'
import { getAll } from '../service/find'

// Custom useField Hook
export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

// custom useCountry Hook
export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (!name) {
      setCountry(null)
      return
    }

    getAll(name)
      .then(data => {
        setCountry({ found: true, data })
      })
      .catch(error => {
        setCountry({ found: false })
      })
  }, [name])

  return country
}
