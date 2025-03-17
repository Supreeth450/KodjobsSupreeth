const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());

// Proxy endpoint for JSearch API
app.get('/api/jobs', async (req, res) => {
  try {
    const query = req.query.query || 'developer';
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1`;
    
    console.log('Proxying request to:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'af54095e6amshccfe1e52f1d9bd0p1c4e26jsnf4ee9907e313',
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return res.status(response.status).send(errorText);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy server error:', error);
    res.status(500).send('Error fetching job data');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
}); 