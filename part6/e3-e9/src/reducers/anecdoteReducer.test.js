import reducer from './anecdoteReducer'
import deepFreeze from 'deep-freeze'

describe("anecdote reducer", () =>{
    const initialState = [
        { content: 'Anecdote 1', id: '1', votes: 0 },
        { content: 'Anecdote 2', id: '2', votes: 0 },
      ];

      test('votes are incremented', () => {
        const action = {
          type: 'VOTE',
          payload: { id: '1' },
        };
        
        deepFreeze(state)
        const newState = reducer(initialState, action);
        expect(newState).toEqual([
          { content: 'Anecdote 1', id: '1', votes: 1 },
          { content: 'Anecdote 2', id: '2', votes: 0 },
        ]);
    });
})

describe('anecdote reducer', () => {
    const initialState = [];
  
    test('new anecdote is added', () => {
      const action = {
        type: 'NEW',
        payload: {
          content: 'New anecdote',
          id: '12345',
          votes: 0,
        },
      };
  
      const newState = reducer(initialState, action);
      expect(newState).toHaveLength(1);
      expect(newState[0].content).toBe('New anecdote');
      expect(newState[0].votes).toBe(0);
    });
  });