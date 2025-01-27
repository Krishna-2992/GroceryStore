import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const ProductManagement = () => {
    // Safely destructure from useStore
    const {
        products,
        addProduct,
        removeProduct
    } = useStore();

    // State for new product form
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        quantity: ''
    });

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate input
        if (!newProduct.name || !newProduct.price || !newProduct.quantity) {
            alert('Please fill in all fields');
            return;
        }

        // Add product
        addProduct({
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            quantity: parseInt(newProduct.quantity)
        });

        // Reset form
        setNewProduct({
            name: '',
            price: '',
            quantity: ''
        });
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Product Management</h2>

            {/* Product Addition Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
                <div className="mb-4">
                    <input
                        type="text"
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3"
                        placeholder="Product Name"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="number"
                        name="price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3"
                        placeholder="Price"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="number"
                        name="quantity"
                        value={newProduct.quantity}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3"
                        placeholder="Quantity"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add Product
                </button>
            </form>

            {/* Product List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map(product => (
                    <div
                        key={product.id}
                        className="border p-4 rounded shadow"
                    >
                        <h3 className="font-bold">{product.name}</h3>
                        <p>Price: ${product.price}</p>
                        <p>Quantity: {product.quantity}</p>
                        <button
                            onClick={() => removeProduct(product.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded mt-2"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductManagement;