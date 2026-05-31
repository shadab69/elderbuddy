const Guide = require('../models/guideModel');

exports.getGuides = async (req, res) => {
    try {
        const guides = await Guide.find();
        res.json(guides);
    } catch (e) {
        res.status(500).json({ message: 'Error retrieving guides', error: e.message });
    }
};

exports.getGuideById = async (req, res) => {
    try {
        const guide = await Guide.findById(req.params.id);
        if (guide) {
            res.json(guide);
        } else {
            res.status(404).json({ message: 'Guide post not found' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error retrieving guide post', error: e.message });
    }
};

exports.createGuide = async (req, res) => {
    try {
        if (!req.body.id) {
            req.body.id = 'g_' + Date.now();
        }
        const guide = await Guide.create(req.body);
        res.status(201).json(guide);
    } catch (e) {
        res.status(400).json({ message: 'Error creating guide post', error: e.message });
    }
};

exports.updateGuide = async (req, res) => {
    try {
        const guide = await Guide.findByIdAndUpdate(req.params.id, req.body);
        if (guide) {
            res.json(guide);
        } else {
            res.status(404).json({ message: 'Guide post not found' });
        }
    } catch (e) {
        res.status(400).json({ message: 'Error updating guide post', error: e.message });
    }
};

exports.deleteGuide = async (req, res) => {
    try {
        const deleted = await Guide.findByIdAndDelete(req.params.id);
        if (deleted) {
            res.json({ message: 'Guide post deleted successfully' });
        } else {
            res.status(404).json({ message: 'Guide post not found' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error deleting guide post', error: e.message });
    }
};
