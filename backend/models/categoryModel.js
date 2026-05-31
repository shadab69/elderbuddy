const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    icon: { type: String, default: 'boxes' },
    desc: { type: String, default: '' }
});

const Category = mongoose.model('Category', categorySchema);

Category.findByIdAndDelete = function(id) {
    return this.findOneAndDelete({ id: id });
};

module.exports = Category;
