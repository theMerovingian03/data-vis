const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const routes = require('./routes/routes');
const { databaseUri } = require('./config/config');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // logging

// connect to mongoDB
mongoose.connect(databaseUri)
    .then(() => {
        console.log("Connection to MongoDB successful");
    })
    .catch((err) => {
        console.log("Error occured while connecting to MongoDB: ", err);
    })


app.use('/api', routes);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is up and running at port: ${PORT}`);
})