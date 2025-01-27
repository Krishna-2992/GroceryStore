import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useProducts } from '../context/ProductContext';

const InventoryModal = ({
    isOpen,
    onClose,
    product,
    onAdjust
}) => {
    const [quantity, setQuantity] = useState('');
    const [type, setType] = useState('add');

    useEffect(() => {
        // Reset form when modal opens
        setQuantity('');
        setType('add');
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdjust(product.id, parseInt(quantity), type);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-2xl mb-4">Adjust Inventory for {product.name}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Adjustment Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                        >
                            <option value="add">Add Stock</option>
                            <option value="remove">Remove Stock</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Quantity</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            required
                            min="1"
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
                            Adjust
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Inventory = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { products, adjustInventory } = useProducts();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const openInventoryModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    // Calculate inventory statistics
    const inventoryStats = {
        totalProducts: products.length,
        // Calculate the total stock quantity by summing up the quantity of each product.
        totalStock: products.reduce((sum, product) => parseInt(sum) + parseInt(product.quantity), 0),
        // Calculate the number of products that have less than 10 items in stock.
        lowStockItems: products.filter(product => product.quantity < 10).length,
        outOfStockItems: products.filter(product => product.quantity === 0).length
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
                    {/* Inventory Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-gray-500 text-sm">Total Products</h3>
                            <p className="text-2xl font-bold">{inventoryStats.totalProducts}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-gray-500 text-sm">Total Stock</h3>
                            <p className="text-2xl font-bold">{inventoryStats.totalStock}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-gray-500 text-sm">Low Stock Items</h3>
                            <p className="text-2xl font-bold text-yellow-500">
                                {inventoryStats.lowStockItems}
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-gray-500 text-sm">Out of Stock</h3>
                            <p className="text-2xl font-bold text-red-500">
                                {inventoryStats.outOfStockItems}
                            </p>
                        </div>
                    </div>

                    {/* Inventory Table */}
                    <div className="bg-white shadow-md rounded">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Product</th>
                                    <th className="py-3 px-6 text-left">Category</th>
                                    <th className="py-3 px-6 text-left">Current Stock</th>
                                    <th className="py-3 px-6 text-left">Status</th>
                                    <th className="py-3 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className={`
                      border-b border-gray-200 hover:bg-gray-100
                      ${product.quantity < 10 ? 'bg-yellow-50' : ''}
                      ${product.quantity === 0 ? 'bg-red-50' : ''}
                    `}
                                    >
                                        <td className="py-3 px-6 text-left whitespace-nowrap">
                                            {product.name}
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            {product.category}
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            {product.quantity}
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            {product.quantity === 0 ? (
                                                <span className="text-red-500">Out of Stock</span>
                                            ) : product.quantity < 10 ? (
                                                <span className="text-yellow-500">Low Stock</span>
                                            ) : (
                                                <span className="text-green-500">In Stock</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <button
                                                onClick={() => openInventoryModal(product)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                Adjust Stock
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* Inventory Adjustment Modal */}
            {selectedProduct && (
                <InventoryModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedProduct(null);
                    }}
                    product={selectedProduct}
                    onAdjust={adjustInventory}
                />
            )}
        </div>
    );
};

export default Inventory;