import React, { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";

const ProductContext = createContext();

const initialState = {
  products: [],
  loading: false,
  error: null,
};

// Action Types
const SET_LOADING = "SET_LOADING";
const SET_ERROR = "SET_ERROR";
const SET_PRODUCTS = "SET_PRODUCTS";
const ADD_PRODUCT = "ADD_PRODUCT";
const UPDATE_PRODUCT = "UPDATE_PRODUCT";
const DELETE_PRODUCT = "DELETE_PRODUCT";

const productReducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    case SET_PRODUCTS:
      return { ...state, products: action.payload };
    case ADD_PRODUCT:
      return { ...state, products: [...state.products, action.payload] };
    case UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        ),
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(
          (product) => product._id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await api.get("/products");
      dispatch({ type: SET_PRODUCTS, payload: response.data.products });
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  const addProduct = async (productData) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await api.post("/products", productData);
      dispatch({ type: ADD_PRODUCT, payload: response.data.product });
      return response.data.product;
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  const updateProduct = async (productData) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await api.put(
        `/products/${productData._id}`,
        productData
      );
      dispatch({ type: UPDATE_PRODUCT, payload: response.data.product });
      return response.data.product;
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  const deleteProduct = async (productId) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      await api.delete(`/products/${productId}`);
      dispatch({ type: DELETE_PRODUCT, payload: productId });
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products: state.products,
        loading: state.loading,
        error: state.error,
        addProduct,
        updateProduct,
        deleteProduct,
        fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
