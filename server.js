const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/transactionsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const transactionSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    dateOfSale: Date,
    sold: Boolean,
    category: String,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.use(express.json());

// Initialize database with data from third-party API
app.get('/initialize-db', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Transaction.deleteMany({});
        await Transaction.insertMany(response.data);
        res.status(200).send('Database initialized successfully');
    } catch (error) {
        res.status(500).send('Error initializing database');
    }
});

// Other APIs to be defined here...
// Get transactions with search and pagination
app.get('/transactions', async (req, res) => {
    const { search = '', page = 1, perPage = 10, month } = req.query;
    const regex = new RegExp(search, 'i');
    const startDate = new Date(2024, month - 1, 1);
    const endDate = new Date(2024, month, 1);

    try {
        const transactions = await Transaction.find({
            $or: [
                { title: regex },
                { description: regex },
                { price: regex },
            ],
            dateOfSale: { $gte: startDate, $lt: endDate },
        })
            .skip((page - 1) * perPage)
            .limit(Number(perPage));
        res.json(transactions);
    } catch (error) {
        res.status(500).send('Error fetching transactions');
    }
});

// Get statistics for selected month
app.get('/statistics', async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(2024, month - 1, 1);
    const endDate = new Date(2024, month, 1);

    try {
        const totalSaleAmount = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lt: endDate }, sold: true } },
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);

        const soldItems = await Transaction.countDocuments({
            dateOfSale: { $gte: startDate, $lt: endDate },
            sold: true
        });

        const notSoldItems = await Transaction.countDocuments({
            dateOfSale: { $gte: startDate, $lt: endDate },
            sold: false
        });

        res.json({
            totalSaleAmount: totalSaleAmount[0]?.total || 0,
            soldItems,
            notSoldItems
        });
    } catch (error) {
        res.status(500).send('Error fetching statistics');
    }
});
// Get bar chart data
app.get('/bar-chart', async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(2024, month - 1, 1);
    const endDate = new Date(2024, month, 1);

    const ranges = [
        [0, 100],
        [101, 200],
        [201, 300],
        [301, 400],
        [401, 500],
        [501, 600],
        [601, 700],
        [701, 800],
        [801, 900],
        [901, Infinity],
    ];

    try {
        const results = await Promise.all(ranges.map(async ([min, max]) => {
            const count = await Transaction.countDocuments({
                dateOfSale: { $gte: startDate, $lt: endDate },
                price: { $gte: min, $lte: max }
            });
            return { range: `${min}-${max}`, count };
        }));
        res.json(results);
    } catch (error) {
        res.status(500).send('Error fetching bar chart data');
    }
});
// Get pie chart data
app.get('/pie-chart', async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(2024, month - 1, 1);
    const endDate = new Date(2024, month, 1);

    try {
        const categories = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);
        res.json(categories);
    } catch (error) {
        res.status(500).send('Error fetching pie chart data');
    }
});
// Get combined data from all APIs
app.get('/combined-data', async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(2024, month - 1, 1);
    const endDate = new Date(2024, month, 1);

    try {
        const [transactions, statistics, barChart, pieChart] = await Promise.all([
            Transaction.find({
                dateOfSale: { $gte: startDate, $lt: endDate }
            }),
            Transaction.aggregate([
                { $match: { dateOfSale: { $gte: startDate, $lt: endDate }, sold: true } },
                { $group: { _id: null, total: { $sum: "$price" } } }
            ]),
            Promise.all(ranges.map(async ([min, max]) => {
                const count = await Transaction.countDocuments({
                    dateOfSale: { $gte: startDate, $lt: endDate },
                    price: { $gte: min, $lte: max }
                });
                return { range: `${min}-${max}`, count };
            })),
            Transaction.aggregate([
                { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
                { $group: { _id: "$category", count: { $sum: 1 } } }
            ])
        ]);

        res.json({
            transactions,
            statistics: {
                totalSaleAmount: statistics[0]?.total || 0,
                soldItems: await Transaction.countDocuments({
                    dateOfSale: { $gte: startDate, $lt: endDate },
                    sold: true
                }),
                notSoldItems: await Transaction.countDocuments({
                    dateOfSale: { $gte: startDate, $lt: endDate },
                    sold: false
                })
            },
            barChart,
            pieChart
        });
    } catch (error) {
        res.status(500).send('Error fetching combined data');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
