const Designer = require('../models/designerModel');

exports.getDesigners = async (req, res) => {
    try {
        const designers = await Designer.find();
        res.json(designers);
    } catch (e) {
        res.status(500).json({ message: 'Error retrieving designers', error: e.message });
    }
};

exports.getDesignerById = async (req, res) => {
    try {
        const designer = await Designer.findById(req.params.id);
        if (designer) {
            res.json(designer);
        } else {
            res.status(404).json({ message: 'Designer not found' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error retrieving designer', error: e.message });
    }
};

exports.createDesigner = async (req, res) => {
    try {
        if (!req.body.id) {
            if (req.body.name) {
                req.body.id = req.body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
            } else {
                req.body.id = 'designer-' + Date.now();
            }
        }
        const designer = await Designer.create(req.body);
        res.status(201).json(designer);
    } catch (e) {
        res.status(400).json({ message: 'Error creating designer', error: e.message });
    }
};

exports.updateDesigner = async (req, res) => {
    try {
        const designer = await Designer.findByIdAndUpdate(req.params.id, req.body);
        if (designer) {
            res.json(designer);
        } else {
            res.status(404).json({ message: 'Designer not found' });
        }
    } catch (e) {
        res.status(400).json({ message: 'Error updating designer', error: e.message });
    }
};

exports.deleteDesigner = async (req, res) => {
    try {
        const deleted = await Designer.findByIdAndDelete(req.params.id);
        if (deleted) {
            res.json({ message: 'Designer deleted successfully' });
        } else {
            res.status(404).json({ message: 'Designer not found' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error deleting designer', error: e.message });
    }
};
