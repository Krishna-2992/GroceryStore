const Product = require('../models/Product');

// Create Product
exports.createProduct = async (req, res) => {
    try {
        const { name, category, quantity, price } = req.body;

        const product = new Product({
            name,
            category,
            quantity,
            price,
            createdBy: req.user.id
        });

        await product.save();

        res.status(201).json({
            product
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating product',
            error: error.message
        });
    }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('createdBy', 'firstName lastName');

        res.json({ products });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// Get Single Product
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('createdBy', 'firstName lastName');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ product });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// Update Product
exports.updateProduct = async (req, res) => {
    try {
        const { name, category, quantity, price } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user is authorized to update (optional)
        if (product.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, category, quantity, price },
            { new: true }
        );

        res.json({ product: updatedProduct });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating product',
            error: error.message
        });
    }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        // Check if user is authorized to delete (optional)
        if (req.user.role == 'user') {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ 
            message: 'Product removed successfully',
            product
        });
        
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting product',
            error: error.message
        });
    }
};