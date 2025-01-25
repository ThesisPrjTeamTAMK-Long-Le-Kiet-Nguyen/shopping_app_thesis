const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

require('dotenv').config();

app.use(cors());
app.use(express.json());

// TO-DO: Implement users routes
// const userRoutes = require('./routes/userRoutes');

const productRoutes = require('./src/routes/productRoutes');

// TO-DO: Implement order routes
// const orderRoutes = require('./routes/orderRoutes');


// app.use('/users', userRoutes);
app.use('/products', productRoutes);
// app.use('/orders', orderRoutes);

// Starting the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});