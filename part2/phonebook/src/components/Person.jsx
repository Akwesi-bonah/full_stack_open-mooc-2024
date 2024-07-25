const Persons = ({ personsToShow, toDelete }) => {
    return (
      <div>
        {personsToShow.map((person, id) => (
          <p key={id}>
            {person.name} {person.number} {}
            {person.id && <button onClick={() => toDelete(person.id, person.name)}>Delete</button>}
          </p>
        ))}
      </div>
    );
  };
  
  export default Persons;
  