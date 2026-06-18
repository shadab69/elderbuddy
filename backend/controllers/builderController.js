const Builder = require('../models/builderModel');

exports.getBuilders = async (req, res) => {
    try {
        const builders = await Builder.find();
        res.json(builders);
    } catch (e) {
        res.status(500).json({ message: 'Error retrieving builders', error: e.message });
    }
};

exports.getBuilderById = async (req, res) => {
    try {
        const builder = await Builder.findById(req.params.id);
        if (builder) {
            res.json(builder);
        } else {
            res.status(404).json({ message: 'Builder not found' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error retrieving builder', error: e.message });
    }
};

exports.createBuilder = async (req, res) => {
    try {
        if (!req.body.id) {
            if (req.body.name) {
                req.body.id = req.body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
            } else {
                req.body.id = 'builder-' + Date.now();
            }
        }
        const builder = await Builder.create(req.body);
        res.status(201).json(builder);
    } catch (e) {
        res.status(400).json({ message: 'Error creating builder', error: e.message });
    }
};

exports.updateBuilder = async (req, res) => {
    try {
        const builder = await Builder.findByIdAndUpdate(req.params.id, req.body);
        if (builder) {
            res.json(builder);
        } else {
            res.status(404).json({ message: 'Builder not found' });
        }
    } catch (e) {
        res.status(400).json({ message: 'Error updating builder', error: e.message });
    }
};

exports.deleteBuilder = async (req, res) => {
    try {
        const deleted = await Builder.findByIdAndDelete(req.params.id);
        if (deleted) {
            res.json({ message: 'Builder deleted successfully' });
        } else {
            res.status(404).json({ message: 'Builder not found' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error deleting builder', error: e.message });
    }
};
