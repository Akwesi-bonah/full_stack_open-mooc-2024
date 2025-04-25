import { createSlice } from "@reduxjs/toolkit";
const initialState = "";


const anecdotesFilter = createSlice({
  name: 'anecdotesFilter',
  initialState,
  reducers:{
    setFilter: (state, action) => action.payload

  }
})

export const { setFilter } = anecdotesFilter.actions

export default anecdotesFilter.reducer;
