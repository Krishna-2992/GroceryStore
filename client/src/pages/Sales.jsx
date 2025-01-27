import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useProducts } from '../context/ProductContext';

const SaleModal = ({ isOpen, onClose, products, onCreateSale }) => {
    const [saleItems, setSaleItems] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);

    const handleAddItem = () => {
        if (!selectedProduct) return;

        const product = products.find(p => p.id === selectedProduct);
        if (!product) return;

        // Check if product already in sale
        const existingItemIndex = saleItems.findIndex(
            item => item.productId === selectedProduct
        );

        if (existingItemIndex > -1) {
            const updatedItems = [...saleItems];
            updatedItems[existingItemIndex].quantity += quantity;
            setSaleItems(updatedItems);
        } else {
            setSaleItems([
                ...saleItems,
                {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity
                }
            ]);
        }

        // Reset selection
        setSelectedProduct('');
        setQuantity(1);
    };

    const handleRemoveItem = (productId) => {
        setSaleItems(saleItems.filter(item => item.productId !== productId));
    };

    const handleSubmit = () => {
        if (saleItems.length === 0) return;

        onCreateSale({
            items: saleItems,
            total: saleItems.reduce(
                (total, item) => total + (item.price * item.quantity),
                0
            )
        });

        // Reset modal
        setSaleItems([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[600px]">
                <h2 className="text-2xl mb-4">Create New Sale</h2>

                {/* Product Selection */}
                <div className="flex mb-4">
                    <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="flex-grow mr-2 px-3 py-2 border rounded"
                    >
                        <option value="">Select Product</option>
                        {products
                            .filter(product => product.quantity > 0)
                            .map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} (Stock: {product.quantity})
                                </option>
                            ))
                        }
                    </select>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                            if (e.target.value > 0) {
                                setQuantity(Number(e.target.value))
                            }
                        }}
                        min="1"
                        className="w-20 mr-2 px-3 py-2 border rounded"
                    />
                    <button
                        onClick={handleAddItem}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Add
                    </button>
                </div>

                {/* Sale Items */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Sale Items</h3>
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left">Product</th>
                                <th className="p-2 text-right">Price</th>
                                <th className="p-2 text-right">Quantity</th>
                                <th className="p-2 text-right">Total</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {saleItems.map(item => (
                                <tr key={item.productId} className="border-b">
                                    <td className="p-2">{item.name}</td>
                                    <td className="p-2 text-right">${item.price.toFixed(2)}</td>
                                    <td className="p-2 text-right">{item.quantity}</td>
                                    <td className="p-2 text-right">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </td>
                                    <td className="p-2 text-center">
                                        <button
                                            onClick={() => handleRemoveItem(item.productId)}
                                            className="text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Total */}
                <div className="text-right font-bold text-xl">
                    Total: $
                    {saleItems
                        .reduce((total, item) => total + (item.price * item.quantity), 0)
                        .toFixed(2)}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        disabled={saleItems.length === 0}
                    >
                        Complete Sale
                    </button>
                </div>
            </div>
        </div>
    );
};

const Sales = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { products, sales, createSale } = useProducts();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Calculate sales statistics
    const salesStats = {
        totalSales: sales.reduce((total, sale) => total + sale.total, 0),
        totalTransactions: sales.length,
        averageTransactionValue: sales.length
            ? sales.reduce((total, sale) => total + sale.total, 0) / sales.length
            : 0
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
                    {/* Sales Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-gray-500 text-sm">Total Sales</h3>
                            <p className="text-2xl font-bold">
                                ${salesStats.totalSales.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-gray-500 text-sm">Total Transactions</h3>
                            <p className="text-2xl font-bold">
                                {salesStats.totalTransactions}
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-gray-500 text-sm">Avg. Transaction Value</h3>
                            <p className="text-2xl font-bold">
                                ${salesStats.averageTransactionValue.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mb-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Create New Sale
                        </button>
                    </div>

                    {/* Sales History */}
                    <div className="bg-white shadow-md rounded">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Date</th>
                                    <th className="py-3 px-6 text-left">Items</th>
                                    <th className="py-3 px-6 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {[...sales].reverse().map((sale) => (
                                    <tr
                                        key={sale.id}
                                        className="border-b border-gray-200 hover:bg-gray-100"
                                    >
                                        <td className="py-3 px-6 text-left">
                                            {new Date(sale.date).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            {sale.items.map(item =>
                                                `${item.name} (${item.quantity})`
                                            ).join(', ')}
                                        </td>
                                        <td className="py-3 px-6 text-right">
                                            ${sale.total.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* Sale Modal */}
            <SaleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                products={products}
                onCreateSale={createSale}
            />
        </div>
    );
};

export default Sales;