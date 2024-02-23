const axios = require('axios');
// const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');

const connection = require('./db_connection');

async function insertIntoDB(data) {
    const {tableName, dataSet} = data;
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${tableName} set ?`, dataSet, (error, result) => {
            if (!error) {
                resolve(result);
            } else {
                reject(error);
            }
        })
    })
}

async function saveToLog(data) {
    try {
        const newData = {
            tableName: 'log',
            dataSet: data
        }
       await insertIntoDB(newData);
       return {success: true, message: 'Log saved to database'}
    } catch (error) {
        return {success: false, message: 'Log failed to save', error: error}
    }
}

async function fetchDataFromBMKG() {
    try {
        const response = await axios.get(process.env.API_AUTOGEMPA_BMKG);
        const result = response.data;

        const dataLog = {
            id: uuidv4(),
            content: JSON.stringify(result),
            success: true
        }
        const resultFromDB = await saveToLog(dataLog);
        return {
            ...resultFromDB,
            data: dataLog
        }
    } catch (error) {
        const dataLog = {
            id: uuidv4(),
            content: error,
            success: false
        }
        const resultFromDB = await saveToLog(dataLog);
        return {
            ...resultFromDB,
            error: error
        };
    }
}


// cron.schedule('*/60 * * * * *', async () => {
//     console.log('Fetching data from BMKG...');
//     const result = await fetchDataFromBMKG();
//     console.log(result)
// });

module.exports = fetchDataFromBMKG;