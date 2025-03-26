// proxy-server.js
import express from 'express';
import axios from 'axios';
import iconv from 'iconv-lite';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/11st', async (req, res) => {
  try {
    const { start, end, key } = req.query;

    if (!start || !end || !key) {
      return res.status(400).json({ error: 'Missing required query params: start, end, key' });
    }

    const url = `https://api.11st.co.kr/rest/ordservices/complete/${start}/${end}?key=${key}`;

    const response = await axios.get(url, {
      responseType: 'arraybuffer', // receive as binary
    });

    const decodedData = iconv.decode(response.data, 'euc-kr');
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(decodedData);
  } catch (error) {
    console.error('Error fetching 11st API:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
});
