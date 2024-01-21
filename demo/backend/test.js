const axios = require('axios');

const webhookUrl = 'http://localhost:3000/webhook'; // Replace with your actual webhook URL

const data = {
    txHash: '0xc54d9b3d1c2655bea0e8d187ce3b8a65877fd43a0c4a86591d572903fcc24b3f',
    email: 'avinashnayak573@gmail.com'
};

axios.post(webhookUrl, data)
    .then(response => {
        console.log('Status:', response.status);
        console.log('Body:', response.data);
    })
    .catch(error => {
        console.error('Error:', error.response.data);
    });
