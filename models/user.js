const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    emailid: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    roomno: { type: String, required: true }
    
});

const usermodel = mongoose.model('User', userSchema);

module.exports = { usermodel };
