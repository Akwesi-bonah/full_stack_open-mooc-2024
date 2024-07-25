import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Person';
import axios from 'axios'
import personObject from './service/person'
import './index.css'
import Notification from './components/Notification';
const App = () => {
  const [persons, setPersons] = useState([
  ])

  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [filter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleAddPerson = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newPhone };
    let confirmUpdate = false; 
  
    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );
  
    if (existingPerson) {
      confirmUpdate = window.confirm(
        `${newName} is already added to the phonebook. Do you want to update the phone number?`
      );
    }
  
    if (confirmUpdate) {
      personObject
        .update(existingPerson.id, newPerson)
        .then((updatedPerson) => {
          const updatedPersons = persons.map((person) =>
            person.id !== existingPerson.id ? person : { ...person, number: newPhone }
          );
          setPersons(updatedPersons);
          setNewName('');
          setNewPhone('');
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      personObject
        .create(newPerson)
        .then((createdPerson) => {
          setPersons(persons.concat(createdPerson));
          setNewName('');
          setNewPhone('');
          setSuccessMessage(`Added ${newName}`);

          setTimeout(() =>
          {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch((error) => {
          console.error('Error adding person:', error);
          setErrorMessage(` ${newName} has already added to the phonebook`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };
  
  const hook = () =>
    {
      console.log('effect')
      personObject
      .getAll()
      .then(initialPersons =>
        {
          setPersons(initialPersons)
        }
      )
      
    }

    useEffect(hook, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  const toDelete = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name}?`);
    if (confirmDelete) {
      personObject
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          setErrorMessage(`Information of ${name} has already been removed from the server`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
          console.error('Error deleting person:', error);
        });
    }
  };
  
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />    
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        handleAddPerson={handleAddPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newPhone={newPhone}
        handlePhoneChange={handlePhoneChange}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} toDelete={toDelete} />
    </div>
  );
};

export default App;
