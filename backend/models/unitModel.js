const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true }
});

const Unit = mongoose.model('Unit', unitSchema);

Unit.findByIdAndDelete = function(id) {
    return this.findOneAndDelete({ id: id });
};

module.exports = Unit;
