require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');
const fetchDataFromBMKG  = require('./cron_job');
const port = 3000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

// Fungsi untuk memeriksa status server BMKG
async function checkBMKGServer() {
    try {
        const response = await axios.get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
        if (response.status === 200) {
            return true; // Server BMKG aktif
        } else {
            return false; // Server BMKG tidak aktif
        }
    } catch (error) {
        return false; // Server BMKG tidak aktif
    }
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

// Route untuk direktori root ("/")
app.get('/', async (req, res) => {
    setTimeout(async () => {
        const bmkgStatus = await checkBMKGServer();
        if (bmkgStatus) {
            res.send('Server running successfully in the background, and BMKG server is up');
        } else {
            res.send('Server running successfully, BMKG server is down');
        }
    }, 10000)
});

// Route untuk direktori ("/autogempa")
app.get('/autogempa', async (req, res) => {
    const isCron = req.header('x-cyclic');
    const secretKey = req.header('secret-key');

    if (isCron === 'cron' && secretKey === process.env.CYCLIC_CRON_CUSTOM_SECRET_KEY) {
        setTimeout(async () => {
            console.log('Fetching data from BMKG...');
            const result = await fetchDataFromBMKG();
            console.log(result);
            res.json(result);
        }, 5000)
    } else {
        res.send('Hehe, mau apa kamu?');
    }
})