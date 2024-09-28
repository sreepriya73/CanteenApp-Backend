const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const router = express.Router();
const { usermodel } = require('./models/user');
const { adminmodel } = require('./models/admin');
const MenuItem = require('../models/menuItem');
const Order = require('../models/Order');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://sreepriya:sreepriya73@cluster0.rwd5pdm.mongodb.net/canteendb?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Helper function to hash passwords
const generateHashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// User Registration Route
app.post('/uregister', async (req, res) => {
    try {
        let input = req.body;
        let hashedPassword = await generateHashedPassword(input.password);
        input.password = hashedPassword;
        let user = new usermodel(input);
        await user.save();
        res.json({ status: 'success' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ status: 'error', message: 'Registration failed', details: error.message });
    }
});


// User Login Route
app.post('/ulogin', async (req, res) => {
    try {
        let input = req.body;
        let user = await usermodel.findOne({ emailid: input.emailid });

        if (!user) {
            return res.json({ status: 'user not exist' });
        }

        let isMatch = await bcrypt.compare(input.password, user.password);

        if (!isMatch) {
            return res.json({ status: 'incorrect' });
        }

        jwt.sign({ email: user.emailid }, 'canteen-app', { expiresIn: '1d' }, (error, token) => {
            if (error) {
                console.error('Token generation error:', error);
                return res.json({ status: 'unable to create token' });
            }
            res.json({ status: 'success', userId: user._id, token: token });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});



app.post("/ALogin", async (req, res) => {
    try {
        let input = req.body;

        // Default admin credentials
        const adminEmail = 'admin@gmail.com';
        const adminPassword = 'admin123';

        // Check if the input matches admin credentials
        if (input.emailid === adminEmail && input.password === adminPassword) {
            console.log(input.emailid);

            // Generate JWT token
            jwt.sign({ email: input.emailid }, "canteen-app", { expiresIn: "1d" }, (error, token) => {
                if (error) {
                    return res.json({ status: "Token credentials failed" });
                }

                // Respond with success and the token
                res.json({ status: "success", token: token, message: "Admin logged in successfully" });
            });
        } else {
            res.json({ status: "invalid credentials" });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});




// GET all menu items
router.get('menu', async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a single menu item by ID
router.get('/menu', async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.status(200).json(menuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new menu item
router.post('menu', async (req, res) => {
    const { name, price, image, description, category } = req.body;
    const newMenuItem = new MenuItem({
        name,
        price,
        image,
        description,
        category
    });

    try {
        const savedMenuItem = await newMenuItem.save();
        res.status(201).json(savedMenuItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT to update an existing menu item
router.put('menu:id', async (req, res) => {
    try {
        const updatedMenuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedMenuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.status(200).json(updatedMenuItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a menu item
router.delete('menu:id', async (req, res) => {
    try {
        const deletedMenuItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!deletedMenuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;


// Start the Server
app.listen(8080, () => {
    console.log('Server started ');
});
