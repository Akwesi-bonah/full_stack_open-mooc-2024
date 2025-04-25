import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',

    reducers:{
        setNotification(state, action){
            return action.payload
        },
        clearNotification(){
            return ''
        }
    }
})

export const showNotification = (message, timeInSeconds = 5) => {
    return async dispatch => {
      dispatch(setNotification(message))
      setTimeout(() => {
        dispatch(clearNotification())
      }, timeInSeconds * 5000)
    }
  }
  
export const { setNotification, clearNotification } = notificationSlice.actions

export default notificationSlice.reducer