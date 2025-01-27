import React, { createContext, useState, useContext } from 'react';

// Create the context
const StoreContext = createContext(null);

// Provider component
export const StoreProvider = ({ children }) => {
    // Initial state with default values
    const [products, setProducts] = useState([
        // You can add some initial products if needed
        // { id: 1, name: 'Sample Product', price: 10, quantity: 100 }
    ]);
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);

    // Functions to manage state
    const addProduct = (product) => {
        setProducts(prevProducts => [...prevProducts, {
            ...product,
            id: prevProducts.length + 1 // Simple ID generation
        }]);
    };

    const removeProduct = (productId) => {
        setProducts(prevProducts =>
            prevProducts.filter(product => product.id !== productId)
        );
    };

    const addToCart = (product) => {
        setCart(prevCart => [...prevCart, product]);
    };

    // Value to be provided to consumers
    const contextValue = {
        products,
        setProducts,
        addProduct,
        removeProduct,
        user,
        setUser,
        cart,
        addToCart
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};

// Custom hook to use the store context
export const useStore = () => {
    const context = useContext(StoreContext);

    // Throw an error if the hook is used outside of the provider
    if (context === null) {
        throw new Error('useStore must be used within a StoreProvider');
    }

    return context;
};