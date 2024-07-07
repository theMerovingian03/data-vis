const axios = require('axios');
const Transaction = require('../models/Transaction');
const { getMonthDateRange } = require('../utils/dateUtils');

const TransactionController = {
    getTransactions: async (req, res) => {
        const { month, search, page = 1, perPage = 10 } = req.query;

        let matchStage = {};
        if (month) {
            const monthIndex = new Date(`${month} 1, 2000`).getMonth() + 1; // Get month index (1-12)
            matchStage = {
                $expr: {
                    $eq: [{ $month: "$dateOfSale" }, monthIndex]
                }
            };
        }

        let searchStage = [];
        if (search) {
            searchStage = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { price: parseFloat(search) || 0 },
            ];
        }

        const query = searchStage.length > 0 ? { $and: [matchStage, { $or: searchStage }] } : matchStage;
        console.log(`Transactions Query: ${JSON.stringify(query)}`);

        try {
            const transactions = await Transaction.find(query)
                .skip((page - 1) * perPage)
                .limit(parseInt(perPage));

            res.status(200).json(transactions);
        } catch (error) {
            console.error(`Error fetching transactions: ${error}`);
            res.status(500).send('Error fetching transactions');
        }
    },

    getStatistics: async (req, res) => {
        const { month } = req.query;

        let matchStage = {};
        if (month) {
            const monthIndex = new Date(`${month} 1, 2000`).getMonth() + 1;
            matchStage = {
                $expr: {
                    $eq: [{ $month: "$dateOfSale" }, monthIndex]
                }
            };
        }

        console.log(`Statistics Query: ${JSON.stringify(matchStage)}`);

        try {
            const totalSaleAmount = await Transaction.aggregate([
                { $match: matchStage },
                { $group: { _id: null, total: { $sum: '$price' } } },
            ]);

            const totalSoldItems = await Transaction.countDocuments({ ...matchStage, sold: true });
            const totalNotSoldItems = await Transaction.countDocuments({ ...matchStage, sold: false });

            res.status(200).json({
                totalSaleAmount: totalSaleAmount[0]?.total || 0,
                totalSoldItems,
                totalNotSoldItems,
            });
        } catch (error) {
            console.error(`Error fetching statistics: ${error}`);
            res.status(500).send('Error fetching statistics');
        }
    },

    getBarChart: async (req, res) => {
        const { month } = req.query;

        let matchStage = {};
        if (month) {
            const monthIndex = new Date(`${month} 1, 2000`).getMonth() + 1;
            matchStage = {
                $expr: {
                    $eq: [{ $month: "$dateOfSale" }, monthIndex]
                }
            };
        }

        console.log(`Bar Chart Query: ${JSON.stringify(matchStage)}`);

        try {
            const ranges = [
                { range: '0-100', min: 0, max: 100 },
                { range: '101-200', min: 101, max: 200 },
                { range: '201-300', min: 201, max: 300 },
                { range: '301-400', min: 301, max: 400 },
                { range: '401-500', min: 401, max: 500 },
                { range: '501-600', min: 501, max: 600 },
                { range: '601-700', min: 601, max: 700 },
                { range: '701-800', min: 701, max: 800 },
                { range: '801-900', min: 801, max: 900 },
                { range: '901-above', min: 901, max: Infinity },
            ];

            const barChart = await Promise.all(ranges.map(async (range) => {
                const count = await Transaction.countDocuments({
                    ...matchStage,
                    price: { $gte: range.min, $lte: range.max === Infinity ? Infinity : range.max },
                });

                return { range: range.range, count };
            }));

            res.status(200).json(barChart);
        } catch (error) {
            console.error(`Error fetching bar chart data: ${error}`);
            res.status(500).send('Error fetching bar chart data');
        }
    },

    getPieChart: async (req, res) => {
        const { month } = req.query;

        let matchStage = {};
        if (month) {
            const monthIndex = new Date(`${month} 1, 2000`).getMonth() + 1;
            matchStage = {
                $expr: {
                    $eq: [{ $month: "$dateOfSale" }, monthIndex]
                }
            };
        }

        console.log(`Pie Chart Query: ${JSON.stringify(matchStage)}`);

        try {
            const pieChart = await Transaction.aggregate([
                { $match: matchStage },
                { $group: { _id: '$category', count: { $sum: 1 } } },
            ]);

            res.status(200).json(pieChart);
        } catch (error) {
            console.error(`Error fetching pie chart data: ${error}`);
            res.status(500).send('Error fetching pie chart data');
        }
    },

    getCombinedStats: async (req, res) => {
        const { month } = req.query;

        try {
            const [transactions, statistics, barChart, pieChart] = await Promise.all([
                axios.get(`http://localhost:5000/api/transactions?month=${month}`),
                axios.get(`http://localhost:5000/api/statistics?month=${month}`),
                axios.get(`http://localhost:5000/api/bar-chart?month=${month}`),
                axios.get(`http://localhost:5000/api/pie-chart?month=${month}`),
            ]);

            res.status(200).json({
                transactions: transactions.data,
                statistics: statistics.data,
                barChart: barChart.data,
                pieChart: pieChart.data,
            });
        } catch (error) {
            console.error(`Error fetching combined data: ${error}`);
            res.status(500).send('Error fetching combined data');
        }
    }
}

module.exports = TransactionController;
