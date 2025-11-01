export function createStore(reducer) {
  let state;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  // Initialize store
  dispatch({ type: '@@INIT' });

  return { getState, dispatch, subscribe };
}

// Cart Reducer
export function cartReducer(state = { items: [] }, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        };
      }
      return { items: [...state.items, { ...action.payload, quantity: 1 }] };
    }

    case 'REMOVE_FROM_CART':
      return { items: state.items.filter(i => i.id !== action.payload) };

    case 'UPDATE_QUANTITY':
      return {
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        )
      };

    default:
      return state;
  }
}

export const store = createStore(cartReducer);
