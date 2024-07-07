// Imports
const express = require('express');
const DbController = require('../controllers/dbController');
const transactionController = require('../controllers/transactionController');

// initialize router
const router = express.Router();

// initialize database
router.get('/init-db', DbController.initDb);

// transaction and statistics routes
router.get('/transactions', transactionController.getTransactions);
router.get('/statistics', transactionController.getStatistics);
router.get('/bar-chart', transactionController.getBarChart);
router.get('/pie-chart', transactionController.getPieChart);
router.get('/combined-data', transactionController.getCombinedStats)

module.exports = router;