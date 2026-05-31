const Category = require('../models/categoryModel');

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (e) {
        res.status(500).json({ message: 'Error retrieving categories', error: e.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        if (!req.body.id && req.body.name) {
            req.body.id = req.body.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        }
        const category = await Category.create(req.body);
        if (category) {
            res.status(201).json(category);
        } else {
            res.status(400).json({ message: 'Category already exists or name invalid' });
        }
    } catch (e) {
        res.status(400).json({ message: 'Error creating category', error: e.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const deleted = await Category.findByIdAndDelete(req.params.id);
        if (deleted) {
            res.json({ message: 'Category deleted successfully' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error deleting category', error: e.message });
    }
};
