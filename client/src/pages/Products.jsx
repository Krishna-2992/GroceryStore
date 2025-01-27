import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useProducts } from '../context/ProductContext';

const ProductModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialProduct
}) => {
    // Provide a default empty product if initialProduct is null
    const [product, setProduct] = useState({
        name: '',
        category: '',
        price: '',
        quantity: ''
    });

    // Use useEffect to update the product state when initialProduct changes
    useEffect(() => {
        // If initialProduct exists, use it; otherwise, reset to default
        if (initialProduct) {
            setProduct(initialProduct);
        } else {
            setProduct({
                name: '',
                category: '',
                price: '',
                quantity: ''
            });
        }
    }, [initialProduct, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // If editing an existing product, include the id
        const productToSubmit = initialProduct?.id
            ? { ...product, id: initialProduct.id }
            : product;

        onSubmit(productToSubmit);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-2xl mb-4">
                    {initialProduct?.id ? 'Edit Product' : 'Add Product'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Category</label>
                        <select
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Groceries">Groceries</option>
                            <option value="Dairy">Dairy</option>
                            <option value="Bakery">Bakery</option>
                            <option value="Produce">Produce</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                            step="0.01"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={product.quantity}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Products = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const {
        products,
        addProduct,
        updateProduct,
        deleteProduct
    } = useProducts();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleAddProduct = (product) => {
        addProduct(product);
    };

    const handleEditProduct = (product) => {
        updateProduct(product);
        setSelectedProduct(null);
    };

    const handleDeleteProduct = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(productId);
        }
    };

    const openAddModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    return (
        <div className="flex h-screen">
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar toggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pt-16 px-6 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">Products</h1>
                        <button
                            onClick={openAddModal}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Add Product
                        </button>
                    </div>

                    {/* Product Table */}
                    <div className="bg-white shadow-md rounded">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Name</th>
                                    <th className="py-3 px-6 text-left">Category</th>
                                    <th className="py-3 px-6 text-left">Price</th>
                                    <th className="py-3 px-6 text-left">Quantity</th>
                                    <th className="py-3 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">
                                            {product.name}
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            {product.category}
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            ${product.price}
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            {product.quantity}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* Product Modal */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedProduct(null);
                }}
                onSubmit={selectedProduct ? handleEditProduct : handleAddProduct}
                initialProduct={selectedProduct}
            />
        </div>
    );
};

export default Products;