describe('Store Reducer Tests', () => {
  // Mock the reducer functionality
  const storeReducer = (state, action) => {
    switch (action.type) {
      case "ADD_TO_CART":
        return {
          ...state,
          cartItems: {
            ...state.cartItems,
            [action.payload]: (state.cartItems[action.payload] || 0) + 1,
          }
        };
      case "REMOVE_FROM_CART":
        const newCartItems = { ...state.cartItems };
        delete newCartItems[action.payload];
        return {
          ...state,
          cartItems: newCartItems,
        };
      case "TOGGLE_WISHLIST": {
        const newWishlist = state.wishlist.includes(action.payload)
          ? state.wishlist.filter((id) => id !== action.payload)
          : [...state.wishlist, action.payload];
        return {
          ...state,
          wishlist: newWishlist,
        };
      }
      default:
        return state;
    }
  };

  test('ADD_TO_CART adds an item to the cart', () => {
    // Initial state
    const initialState = { cartItems: {} };
    
    // Add item with ID 'product1' to cart
    const newState = storeReducer(initialState, { 
      type: 'ADD_TO_CART', 
      payload: 'product1' 
    });
    
    // Expect cart to contain product1 with quantity 1
    expect(newState.cartItems).toEqual({ 'product1': 1 });
    
    // Add the same item again
    const updatedState = storeReducer(newState, { 
      type: 'ADD_TO_CART', 
      payload: 'product1' 
    });
    
    // Expect cart to contain product1 with quantity 2
    expect(updatedState.cartItems).toEqual({ 'product1': 2 });
  });

  test('REMOVE_FROM_CART removes an item from the cart', () => {
    // Initial state with items in cart
    const initialState = { 
      cartItems: { 
        'product1': 2, 
        'product2': 1 
      } 
    };
    
    // Remove product1 from cart
    const newState = storeReducer(initialState, { 
      type: 'REMOVE_FROM_CART', 
      payload: 'product1' 
    });
    
    // Expect cart to only contain product2
    expect(newState.cartItems).toEqual({ 'product2': 1 });
    expect(newState.cartItems['product1']).toBeUndefined();
  });

  test('TOGGLE_WISHLIST adds an item to empty wishlist', () => {
    // Initial state with empty wishlist
    const initialState = { wishlist: [] };
    
    // Toggle product1 in wishlist (should add it)
    const newState = storeReducer(initialState, { 
      type: 'TOGGLE_WISHLIST', 
      payload: 'product1' 
    });
    
    // Expect wishlist to contain product1
    expect(newState.wishlist).toEqual(['product1']);
  });

  test('TOGGLE_WISHLIST removes an item from wishlist if already present', () => {
    // Initial state with items in wishlist
    const initialState = { wishlist: ['product1', 'product2'] };
    
    // Toggle product1 in wishlist (should remove it)
    const newState = storeReducer(initialState, { 
      type: 'TOGGLE_WISHLIST', 
      payload: 'product1' 
    });
    
    // Expect wishlist to only contain product2
    expect(newState.wishlist).toEqual(['product2']);
  });
});
