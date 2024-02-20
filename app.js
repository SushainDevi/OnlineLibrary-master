// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// Create an Express application
const app = express();

// Set the port for the server to listen on
const PORT = 5000;

// Enable CORS middleware to allow cross-origin requests
app.use(cors({
  origin: 'https://online-library-eight-delta.vercel.app'
}));

// Parse incoming JSON requests
app.use(express.json());

// Connect to MongoDB database
mongoose.connect("mongodb+srv://shreyaskalate9:shreyas123123@databaseconnect.a4gtyyu.mongodb.net/bookDatabase", { useNewUrlParser: true, useUnifiedTopology: true });

// Define the schema for a cart item in the database
const cartItemSchema = new mongoose.Schema({
    bookId: Number,
    title: String,
    author: String,
    issuedBy: String, // Add the 'issuedBy' field for the name of the student
    prn: String,      // Add the 'prn' field for the PRN of the student
    imageSrc: String,
});

// Create a model based on the cartItemSchema
const CartItem = mongoose.model('CartItem', cartItemSchema);

// Serve static files from the 'library' directory
// IMPORTANT: Update these paths if you've moved any directories (e.g., 'images') outside 'library'
app.use('/library', express.static(path.join(__dirname, 'library')));
app.use('/library/images', express.static(path.join(__dirname, 'library', 'images')));
app.use('/library/styles', express.static(path.join(__dirname, 'library', 'styles')));

// Define routes for various pages
// Update paths if your HTML files are in different locations within the root directory
app.get('/', (req, res) => res.sendFile('index.html', { root: __dirname })); // Assuming 'index.html' is now in the root
app.get('/home', (req, res) => res.sendFile('library/home.html', { root: __dirname })); // Including path to 'library'
app.get('/about_us', (req, res) => res.sendFile('library/about_us.html', { root: __dirname }));
app.get('/our_books', (req, res) => res.sendFile('library/our_books.html', { root: __dirname }));
app.get('/our_services', (req, res) => res.sendFile('library/our_services.html', { root: __dirname }));
app.get('/cart', (req, res) => res.sendFile('library/cart.html', { root: __dirname }));

// Handle other routes for .js files (if needed)
// Example:
app.get('/library/cart.js', (req, res) => res.sendFile('library/cart.js', { root: __dirname }));

// Handle preflight requests for the '/issue' endpoint
app.options('/issue', cors());

// Handle a POST request to '/issue' for issuing items to the database
app.post('/issue', async (req, res) => {
    try {
        // Extract cart items from the request body
        const cartItems = req.body.cartItems;

        // Save each cart item to the database
        for (const cartItem of cartItems) {
            await new CartItem(cartItem).save();
        }

        // Respond with success message
        res.json({ success: true, message: 'Items issued and saved to the database' });
    } catch (error) {
        // Log and respond with an error message
        console.error(error);
        res.status(500).json({ success: false, message: 'Error issuing items to the database', error: error.message });
    }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});