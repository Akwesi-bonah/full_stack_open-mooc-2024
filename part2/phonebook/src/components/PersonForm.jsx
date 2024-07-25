const PersonForm = ({ handleAddPerson, newName, handleNameChange, newPhone, handlePhoneChange }) => {
    return (
        <form onSubmit={handleAddPerson}>
            <div>
                Name: <input value={newName} onChange={handleNameChange} />
            </div>
            <br></br>
            <div>
                Number: <input value={newPhone} onChange={handlePhoneChange} />
            </div>
            <br></br>
            <div>
                <button type="submit">Add</button>
            </div>
        </form>
    );
};

export default PersonForm;
