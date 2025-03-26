// ✅ 정확한 목적: EUC-KR XML → UTF-8 XML로 변환해서 그대로 전달

import express from 'express';
import axios from 'axios';
import iconv from 'iconv-lite';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/11st', async (req, res) => {
  try {
    const { start, end, key } = req.query;

    // 필수 파라미터 체크
    if (!start || !end || !key) {
      return res.status(400).json({ error: 'Missing required query params: start, end, key' });
    }

    // ✅ 11번가 API 가이드대로 key는 쿼리스트링에 포함
    const url = `https://api.11st.co.kr/rest/ordservices/complete/${start}/${end}?key=${key}`;

    const response = await axios.get(url, {
      responseType: 'arraybuffer', // EUC-KR 수신을 위한 설정
    });

    // ✅ EUC-KR → UTF-8 변환
    const decodedData = iconv.decode(response.data, 'euc-kr');

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(decodedData);
  } catch (error) {
    // 🔥 디버깅 정보 전체 출력
    console.error('🔥 Error fetching 11st API:', {
      message: error.message,
      status: error.response?.status,
      headers: error.response?.headers,
      data: iconv.decode(error.response?.data || '', 'euc-kr'),
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
});