const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    imageSrc: { type: String, required: true },
    link: { type: String, default: '#/products' },
    styleType: { type: String, default: 'cover' },
    position: { type: String, default: 'center' },
    bgColor: { type: String, default: '#ffffff' }
});

const Banner = mongoose.model('Banner', bannerSchema);

Banner.findById = function(id) {
    return this.findOne({ id: id });
};
Banner.findByIdAndUpdate = function(id, data) {
    return this.findOneAndUpdate({ id: id }, data, { new: true });
};
Banner.findByIdAndDelete = function(id) {
    return this.findOneAndDelete({ id: id });
};

module.exports = Banner;
