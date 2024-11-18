const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    MaXe: { type: String, required: true },
    Name: { type: String, required: true },
    Price: { type: Number, required: true },
    Year: { type: Number, required: true },
    Brand: { type: String, required: true }
});

module.exports = mongoose.model('Car', carSchema);
