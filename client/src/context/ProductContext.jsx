import React, { createContext, useReducer, useContext, useEffect } from 'react';

// Initial state with local storage
const getInitialState = () => {
    const storedProducts = localStorage.getItem('products');
    const storedSales = localStorage.getItem('sales');

    return {
        products: storedProducts ? JSON.parse(storedProducts) : [],
        sales: storedSales ? JSON.parse(storedSales) : []
    };
};

// Create context
const ProductContext = createContext();

// Action Types
const ADD_PRODUCT = 'ADD_PRODUCT';
const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
const DELETE_PRODUCT = 'DELETE_PRODUCT';
const ADJUST_INVENTORY = 'ADJUST_INVENTORY';
const CREATE_SALE = 'CREATE_SALE';
const SET_PRODUCTS = 'SET_PRODUCTS';

// Reducer Function
const productReducer = (state, action) => {
    let newState;

    switch (action.type) {
        case ADD_PRODUCT:
            newState = {
                ...state,
                products: [...state.products, {
                    ...action.payload,
                    id: Date.now().toString(),
                    price: Number(action.payload.price),
                    quantity: Number(action.payload.quantity)
                }]
            };
            localStorage.setItem('products', JSON.stringify(newState.products));
            return newState;

        case UPDATE_PRODUCT:
            newState = {
                ...state,
                products: state.products.map(product =>
                    product.id === action.payload.id
                        ? {
                            ...product,
                            ...action.payload,
                            price: Number(action.payload.price),
                            quantity: Number(action.payload.quantity)
                        }
                        : product
                )
            };
            localStorage.setItem('products', JSON.stringify(newState.products));
            return newState;

        case DELETE_PRODUCT:
            newState = {
                ...state,
                products: state.products.filter(product => product.id !== action.payload)
            };
            localStorage.setItem('products', JSON.stringify(newState.products));
            return newState;

        case ADJUST_INVENTORY:
            newState = {
                ...state,
                products: state.products.map(product => {
                    if (product.id === action.payload.productId) {
                        const currentQuantity = Number(product.quantity);
                        const adjustmentQuantity = Number(action.payload.quantity);

                        const newQuantity = action.payload.type === 'add'
                            ? currentQuantity + adjustmentQuantity
                            : currentQuantity - adjustmentQuantity;

                        return {
                            ...product,
                            quantity: Math.max(0, newQuantity)
                        };
                    }
                    return product;
                })
            };
            localStorage.setItem('products', JSON.stringify(newState.products));
            return newState;

        case CREATE_SALE:
            newState = {
                ...state,
                sales: [...state.sales, {
                    id: Date.now().toString(),
                    ...action.payload,
                    date: new Date().toISOString()
                }]
            };
            localStorage.setItem('sales', JSON.stringify(newState.sales));
            return newState;

        case SET_PRODUCTS:
            newState = {
                ...state,
                products: action.payload
            };
            localStorage.setItem('products', JSON.stringify(newState.products));
            return newState;

        default:
            return state;
    }
};

// Context Provider
export const ProductProvider = ({ children }) => {
    const [state, dispatch] = useReducer(productReducer, getInitialState());

    // Action Creators
    const addProduct = (product) => {
        dispatch({
            type: ADD_PRODUCT,
            payload: {
                ...product,
                price: Number(product.price),
                quantity: Number(product.quantity)
            }
        });
    };

    const updateProduct = (product) => {
        dispatch({
            type: UPDATE_PRODUCT,
            payload: {
                ...product,
                price: Number(product.price),
                quantity: Number(product.quantity)
            }
        });
    };

    const deleteProduct = (productId) => {
        dispatch({ type: DELETE_PRODUCT, payload: productId });
    };

    const adjustInventory = (productId, quantity, type = 'add') => {
        dispatch({
            type: ADJUST_INVENTORY,
            payload: {
                productId,
                quantity: Number(quantity),
                type
            }
        });
    };

    const createSale = (saleData) => {
        const processedSale = {
            ...saleData,
            total: saleData.items.reduce((total, item) =>
                total + (Number(item.price) * Number(item.quantity)), 0)
        };

        // Update product quantities
        saleData.items.forEach(item => {
            adjustInventory(item.productId, item.quantity, 'remove');
        });

        dispatch({
            type: CREATE_SALE,
            payload: processedSale
        });
    };

    const setProducts = (products) => {
        dispatch({ type: SET_PRODUCTS, payload: products });
    };

    return (
        <ProductContext.Provider value={{
            products: state.products,
            sales: state.sales,
            addProduct,
            updateProduct,
            deleteProduct,
            adjustInventory,
            createSale,
            setProducts
        }}>
            {children}
        </ProductContext.Provider>
    );
};

// Custom hook
export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};