// const mongoose = require('mongoose');

// const adminSchema = new mongoose.Schema({
//     emailid: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
    
    
// });

// const adminmodel = mongoose.model('Admin', adminSchema);

// module.exports = { adminmodel };
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    emailid: { type: String, required: true, unique: true },
    password: { type: String, required: true },  // Password field for future use
    loginTime: { type: Date, default: Date.now }  // Optional: Store login time
});

const adminmodel = mongoose.model('Admin', adminSchema);

module.exports = { adminmodel };
