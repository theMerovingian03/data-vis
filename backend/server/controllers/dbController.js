const Transaction = require('../models/Transaction');
const axios = require('axios');

const DbController = {
    initDb: async (req, res) => {
        try {
            const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
            const data = response.data;

            await Transaction.deleteMany({});
            await Transaction.insertMany(data);

            res.status(200).send('Database initialized with seed data');
        } catch (error) {
            res.status(500).send('Error initializing database');
        }
    }
}

module.exports = DbController;