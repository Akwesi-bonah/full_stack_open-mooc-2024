const Filter = ({ filter, handleFilterChange }) => {
    return (
        <div>
            <p>Filter shown with <input value={filter} onChange={handleFilterChange} /></p>
        </div>
    );
};

export default Filter;

