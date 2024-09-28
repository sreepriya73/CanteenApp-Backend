const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true, // URL of the image
    },
    description: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: false,
    },
}, { timestamps: true });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = MenuItem;
