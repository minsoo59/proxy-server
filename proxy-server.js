// proxy-server.js
import express from 'express';
import axios from 'axios';
import iconv from 'iconv-lite';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/11st', async (req, res) => {
  const { start, end, key } = req.query;

  // ✅ 필수 파라미터 확인
  if (!start || !end || !key) {
    return res.status(400).json({ error: 'Missing required query params: start, end, key' });
  }

  try {
    const url = `https://api.11st.co.kr/rest/ordservices/complete/${start}/${end}?key=${key}`;

    const response = await axios.get(url, {
      responseType: 'arraybuffer', // 바이너리 수신
    });

    // ✅ EUC-KR → UTF-8 변환
    const decodedData = iconv.decode(response.data, 'euc-kr');

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(decodedData);
  } catch (error) {
    // ✅ 에러 원인을 더 자세히 로그에 출력
    console.error('🔥 Error fetching 11st API:', {
      message: error.message,
      status: error?.response?.status,
      headers: error?.response?.headers,
      data: error?.response?.data && iconv.decode(error.response.data, 'euc-kr'),
    });

    res.status(500).json({
      error: 'Internal server error',
      detail: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
});