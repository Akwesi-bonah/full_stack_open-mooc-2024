import React, { useState, useEffect } from 'react';
import { getAll } from './service/find';

const App = () => {
  const [value, setValue] = useState('');
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [error, setError] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    getAll().then(data => {
      console.log(data)
      setAllCountries(data);
    }).catch(error => {
      console.error('Error fetching all countries:', error);
    });
  }, []);

  useEffect(() => {
    console.log(value)
    if (value) {
      const matches = allCountries.filter(country =>
        country.name.common.toLowerCase().includes(value.toLowerCase())
      );

      if (matches.length > 10) {
        setError('Too many matches, specify another filter');
        setFilteredCountries([]);
      } else if (matches.length === 0) {
        setError('No matches found');
        setFilteredCountries([]);
      } else {
        setError('');
        setFilteredCountries(matches);
      }
    } else {
      setFilteredCountries([]);
      setError('');
    }
  }, [value, allCountries]);

 
  const handleChange = (event) => {
    setValue(event.target.value);
    setSelectedCountry(null);
  };

  const handleShowDetails = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div>
      <p>
        find countries
        <input
          value={value}
          onChange={handleChange}
        />
      </p>
      {error && <p>{error}</p>}
      {selectedCountry ? (
        <div>
          <h1>{selectedCountry.name.common}</h1>
          <p>Capital: {selectedCountry.capital}</p>
          <p>Area: {selectedCountry.area} km²</p>
          <p>Languages:</p>
          <ul>
            {Object.values(selectedCountry.languages).map((language, index) => (
              <li key={index}>{language}</li>
            ))}
          </ul>
          <img
            src={selectedCountry.flags.png}
            alt={`Flag of ${selectedCountry.name.common}`}
            
          />
          <button onClick={() => setSelectedCountry(null)}>Back</button>
        </div>
      ) : (
        filteredCountries.length > 0 && (
          <ul>
            {filteredCountries.map(country => (
              <li key={country.name.common}>
                {country.name.common}
                <button onClick={() => handleShowDetails(country)}>Show details</button>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};

export default App;
