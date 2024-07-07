require('dotenv').config();

module.exports = {
    databaseUri: process.env.MONGO_URI,
}