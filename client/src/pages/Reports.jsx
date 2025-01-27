import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useProducts } from '../context/ProductContext';

// Chart library (optional, but recommended)
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const Reports = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [reportType, setReportType] = useState('sales');
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    const { products, sales } = useProducts();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Filter sales based on date range
    const filteredSales = useMemo(() => {
        return sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return (
                saleDate >= new Date(dateRange.start) &&
                saleDate <= new Date(dateRange.end)
            );
        });
    }, [sales, dateRange]);

    // Sales Report Data
    const salesReportData = useMemo(() => {
        const monthlySales = {};

        filteredSales.forEach(sale => {
            const month = new Date(sale.date).toLocaleString('default', { month: 'short' });
            monthlySales[month] = (monthlySales[month] || 0) + sale.total;
        });

        return Object.keys(monthlySales).map(month => ({
            month,
            sales: monthlySales[month]
        }));
    }, [filteredSales]);

    // Inventory Report Data
    const inventoryReportData = useMemo(() => {
        return products.map(product => ({
            name: product.name,
            quantity: product.quantity,
            value: product.quantity * product.price
        })).sort((a, b) => b.value - a.value);
    }, [products]);

    // Product Performance Report
    const productPerformanceData = useMemo(() => {
        const productSales = {};

        filteredSales.forEach(sale => {
            sale.items.forEach(item => {
                productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
            });
        });

        return Object.keys(productSales)
            .map(name => ({
                name,
                quantity: productSales[name]
            }))
            .sort((a, b) => b.quantity - a.quantity);
    }, [filteredSales]);

    // Render Report Based on Type
    const renderReport = () => {
        switch (reportType) {
            case 'sales':
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Monthly Sales Report</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salesReportData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-4">
                            <p>Total Sales: ${filteredSales.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}</p>
                            <p>Number of Transactions: {filteredSales.length}</p>
                        </div>
                    </div>
                );

            case 'inventory':
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Inventory Valuation</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={inventoryReportData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#82ca9d" name="Inventory Value" />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-4">
                            <p>Total Inventory Value: $
                                {inventoryReportData
                                    .reduce((sum, item) => sum + item.value, 0)
                                    .toFixed(2)}
                            </p>
                        </div>
                    </div>
                );

            case 'product-performance':
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Product Performance</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={productPerformanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="quantity" fill="#ffc658" name="Units Sold" />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-4">
                            <p>Top Selling Product: {productPerformanceData[0]?.name || 'N/A'}</p>
                            <p>Total Units Sold: {productPerformanceData.reduce((sum, item) => sum + item.quantity, 0)}</p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
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
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold">Reports</h1>
                    </div>

                    {/* Report Controls */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div>
                                <label className="block mb-2">Report Type</label>
                                <select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    className="px-3 py-2 border rounded w-full"
                                >
                                    <option value="sales">Sales Report</option>
                                    <option value="inventory">Inventory Valuation</option>
                                    <option value="product-performance">Product Performance</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2">Start Date</label>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange(prev => ({
                                        ...prev,
                                        start: e.target.value
                                    }))}
                                    className="px-3 py-2 border rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">End Date</label>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange(prev => ({
                                        ...prev,
                                        end: e.target.value
                                    }))}
                                    className="px-3 py-2 border rounded w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Report Visualization */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        {renderReport()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Reports;