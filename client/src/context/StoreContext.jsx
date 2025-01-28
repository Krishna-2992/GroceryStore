import React, { createContext, useReducer, useContext } from "react";

const StoreContext = createContext();

const initialState = {
  cart: [],
  user: null,
  error: null,
};

// Action Types
const SET_USER = "SET_USER";
const ADD_TO_CART = "ADD_TO_CART";
const REMOVE_FROM_CART = "REMOVE_FROM_CART";
const UPDATE_CART_ITEM = "UPDATE_CART_ITEM";
const CLEAR_CART = "CLEAR_CART";
const SET_ERROR = "SET_ERROR";

const storeReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case ADD_TO_CART:
      const existingItem = state.cart.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((item) => item._id !== action.payload),
      };
    case UPDATE_CART_ITEM:
      return {
        ...state,
        cart: state.cart.map((item) =>
          item._id === action.payload._id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case CLEAR_CART:
      return { ...state, cart: [] };
    case SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  const setUser = (userData) => {
    dispatch({ type: SET_USER, payload: userData });
  };

  const addToCart = (product) => {
    if (product.quantity > 0) {
      dispatch({ type: ADD_TO_CART, payload: product });
    } else {
      dispatch({ type: SET_ERROR, payload: "Product is out of stock" });
    }
  };

  const removeFromCart = (productId) => {
    dispatch({ type: REMOVE_FROM_CART, payload: productId });
  };

  const updateCartItem = (productId, quantity) => {
    dispatch({
      type: UPDATE_CART_ITEM,
      payload: { _id: productId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  const cartTotal = state.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartItemsCount = state.cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <StoreContext.Provider
      value={{
        user: state.user,
        cart: state.cart,
        error: state.error,
        cartTotal,
        cartItemsCount,
        setUser,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
