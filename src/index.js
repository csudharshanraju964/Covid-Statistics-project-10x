const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8090;

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')

app.get("/totalRecovered", async (req, res) => {
    try {
        let data = await connection.find()
        let total = 0;
        for (let i = 0; i < data.length; i++) {
            total += data[i].recovered;
        }
        res.status(200).json({
            data:{_id: "total", recovered: total}
        });
    } catch (e) {
        res.status(500).json({ error: error.message });
    }
})

app.get("/totalActive", async (req, res) => {
    try {
        let data = await connection.find()
        let total = 0;
        for (let i = 0; i < data.length; i++) {
            total += (data[i].infected - data[i].recovered);
        }
        res.status(200).json({
           data:{ _id: "total", active: total}
        });
    } catch (e) {
        res.status(500).json({ error: error.message });
    }
})
app.get('/totalDeath', async (req, res) => {
    try {
        const data = await connection.find();
        let totalDeath = 0;
        for (let i = 0; i < data.length; i++) {
            totalDeath += data[i].death;
        }
        res.status(200).json({ data: { _id: 'total', death: totalDeath } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/hotspotStates", async (req, res) => {
    try {
        const data = await connection.find();
        const hotspotStates = [];
        for (let i = 0; i < data.length; i++) {
            const infected = data[i].infected;
            const recovered = data[i].recovered;
            const state = data[i].state;
            const rate = ((infected - recovered) / infected).toFixed(5);
            if (rate > 0.1) {
                hotspotStates.push({ state: state, rate: rate });
            }
        }
        res.status(200).json({ data: hotspotStates });
    } catch (e) {
        res.send(e.message);
    }
});
app.get("/healthyStates", async (req, res) => {
    try {
        const data = await connection.find();
        const healthyStates = [];
        for (let i = 0; i < data.length; i++) {
            const infected = data[i].infected;
            const death = data[i].death;
            const state = data[i].state;
            const mortality = (death / infected).toFixed(5);
            if (mortality < 0.005) {
                healthyStates.push({ state: state, mortality: mortality });
            }
        }
        res.status(200).json({ data: healthyStates });
    } catch (e) {
        res.send(e.message);
    }
});






app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;