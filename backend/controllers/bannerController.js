const Banner = require('../models/bannerModel');

exports.getBanners = async (req, res) => {
    try {
        const banners = await Banner.find();
        res.json(banners);
    } catch (e) {
        res.status(500).json({ message: 'Error retrieving banners', error: e.message });
    }
};

exports.getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (banner) {
            res.json(banner);
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error retrieving banner', error: e.message });
    }
};

exports.createBanner = async (req, res) => {
    try {
        if (!req.body.id) {
            req.body.id = 'b_' + Date.now();
        }
        const banner = await Banner.create(req.body);
        res.status(201).json(banner);
    } catch (e) {
        res.status(400).json({ message: 'Error creating banner', error: e.message });
    }
};

exports.updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndUpdate(req.params.id, req.body);
        if (banner) {
            res.json(banner);
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (e) {
        res.status(400).json({ message: 'Error updating banner', error: e.message });
    }
};

exports.deleteBanner = async (req, res) => {
    try {
        const deleted = await Banner.findByIdAndDelete(req.params.id);
        if (deleted) {
            res.json({ message: 'Banner deleted successfully' });
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error deleting banner', error: e.message });
    }
};
