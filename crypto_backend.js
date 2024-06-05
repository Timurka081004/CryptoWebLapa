const axios = require('axios');
const mysql = require('mysql');

// Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crypto_data'
});

// Database connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connection to the database established successfully');
});

// Function to get cryptocurrency data from the CoinGecko API
async function getCryptoData() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
    return response.data;
  } catch (error) {
    console.error('Error fetching data from the API:', error);
    throw error;
  }
}

// Function to update cryptocurrency data in the database
async function updateCryptoData() {
  try {
    const cryptoData = await getCryptoData();
    for (const crypto of cryptoData) {
      const { name, current_price, price_change_percentage_24h } = crypto;
      const checkIfExistsQuery = 'SELECT * FROM crypto_info WHERE currency_name = ?';
      connection.query(checkIfExistsQuery, [name], (err, results) => {
        if (err) {
          console.error('Error checking if record exists:', err);
          return;
        }
        if (results.length === 0) {
          const insertQuery = `INSERT INTO crypto_info (currency_name, price, price_change_24h) VALUES (?, ?, ?)`;
          connection.query(insertQuery, [name, current_price, price_change_percentage_24h], (err, results) => {
            if (err) {
              console.error('Error inserting new record:', err);
            } else {
              console.log('New record successfully added:', results);
            }
          });
        } else {
          const updateQuery = `UPDATE crypto_info SET price = ?, price_change_24h = ? WHERE currency_name = ?`;
          connection.query(updateQuery, [current_price, price_change_percentage_24h, name], (err, results) => {
            if (err) {
              console.error('Error updating existing record:', err);
            } else {
              console.log('Record successfully updated:', results);
            }
          });
        }
      });
    }
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

// Run the update function every minute
setInterval(updateCryptoData, 60000);
