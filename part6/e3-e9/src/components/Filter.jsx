import { useDispatch } from "react-redux";
import { setFilter } from "../reducers/filterReducer";


const Filter = () => {
    const dispatch = useDispatch();

    const handleChange = (event) => {
        event.preventDefault()
        const content = event.target.value
       
        
        dispatch(setFilter(content))
        // input-field value is in variable event.target.value
    }
    const style = {
      marginBottom: 10
    }
  
    return (
      <div style={style}>
        filter <input 
        type="text" 
         onChange={handleChange} />
      </div>
    )
  }
  
  export default Filter