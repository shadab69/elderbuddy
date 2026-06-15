const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    year: { type: String, required: true },
    desc: { type: String },
    images: [{ type: String }]
});

const designerSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatarText: { type: String },
    avatarBg: { type: String },
    avatarImg: { type: String },
    firm: { type: String, required: true },
    experience: { type: String, required: true },
    rating: { type: String, default: "5.0" },
    reviewsCount: { type: Number, default: 0 },
    completedProjects: { type: Number, default: 0 },
    specialties: [{ type: String }],
    bio: { type: String, required: true },
    fullBio: { type: String, required: true },
    projects: [projectSchema]
});

const Designer = mongoose.model('Designer', designerSchema);

Designer.findById = function(id) {
    return this.findOne({ id: id });
};
Designer.findByIdAndUpdate = function(id, data) {
    return this.findOneAndUpdate({ id: id }, data, { new: true });
};
Designer.findByIdAndDelete = function(id) {
    return this.findOneAndDelete({ id: id });
};

module.exports = Designer;
