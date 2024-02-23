require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');
const port = 3000;

require('./cron_job');

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });