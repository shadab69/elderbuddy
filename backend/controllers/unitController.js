const Unit = require('../models/unitModel');

exports.getUnits = async (req, res) => {
    try {
        const units = await Unit.find();
        res.json(units);
    } catch (e) {
        res.status(500).json({ message: 'Error retrieving units', error: e.message });
    }
};

exports.createUnit = async (req, res) => {
    try {
        if (!req.body.id && req.body.name) {
            req.body.id = req.body.name.replace(/[^a-zA-Z0-9]/g, '');
        }
        const unit = await Unit.create(req.body);
        if (unit) {
            res.status(201).json(unit);
        } else {
            res.status(400).json({ message: 'Unit already exists or name invalid' });
        }
    } catch (e) {
        res.status(400).json({ message: 'Error creating unit', error: e.message });
    }
};

exports.deleteUnit = async (req, res) => {
    try {
        const deleted = await Unit.findByIdAndDelete(req.params.id);
        if (deleted) {
            res.json({ message: 'Unit deleted successfully' });
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error deleting unit', error: e.message });
    }
};
