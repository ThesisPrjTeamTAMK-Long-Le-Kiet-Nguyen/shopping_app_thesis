require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const userRoutes = require('./backend/routes/userRoutes');
const productRoutes = require('./backend/routes/productRoutes');
const orderRoutes = require('./backend/routes/orderRoutes');
const cartRoutes = require('./backend/routes/cartRoutes');

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/carts', cartRoutes);

// Starting the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});