const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    imageSrc: { type: String, required: true },
    content: { type: String }
});

const Guide = mongoose.model('Guide', guideSchema);

Guide.findById = function(id) {
    return this.findOne({ id: id });
};
Guide.findByIdAndUpdate = function(id, data) {
    return this.findOneAndUpdate({ id: id }, data, { new: true });
};
Guide.findByIdAndDelete = function(id) {
    return this.findOneAndDelete({ id: id });
};

module.exports = Guide;
