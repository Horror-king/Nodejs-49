const express = require('express');
const https = require('https');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const spellApiKey = 'ZppA2GJWBm1tpuHC2jfFfhDlupo1S30V'; // Replace with your actual API key
const spellApiHost = 'api.apilayer.com';

app.use(cors()); // Enable CORS

app.get('/spell', (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  const options = {
    method: 'GET',
    hostname: spellApiHost,
    path: `/spell/spellchecker?q=${encodeURIComponent(query)}`,
    headers: {
      'apikey': spellApiKey
    }
  };

  const apiReq = https.request(options, apiRes => {
    let chunks = [];

    apiRes.on('data', chunk => {
      chunks.push(chunk);
    });

    apiRes.on('end', () => {
      const body = Buffer.concat(chunks);
      const response = JSON.parse(body.toString());
      res.json(response);
    });
  });

  apiReq.on('error', error => {
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  });

  apiReq.end();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
