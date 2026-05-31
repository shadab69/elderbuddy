const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discountLabel: { type: String },
    unit: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, default: 5.0 },
    ratingCount: { type: Number, default: 1 },
    imageSrc: { type: String },
    specs: { type: mongoose.Schema.Types.Mixed, default: {} }
});

const Product = mongoose.model('Product', productSchema);

// Custom query mappings for MVC controller backward compatibility
Product.findById = function(id) {
    return this.findOne({ id: id });
};
Product.findByIdAndUpdate = function(id, data) {
    return this.findOneAndUpdate({ id: id }, data, { new: true });
};
Product.findByIdAndDelete = function(id) {
    return this.findOneAndDelete({ id: id });
};

module.exports = Product;
