const PersonForm = ({ handleSearch, newName , handleNameChange}) => {
    return (
        <form onSubmit={handleSearch}>
            <div>
                Find countries: <input value={newName} onChange={handleNameChange} />
            </div>
            <div>
                <button type="submit">Add</button>
            </div>
        </form>
    );
};

export default PersonForm;
