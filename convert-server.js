// 파일명: convert-server.js
import express from 'express';
import iconv from 'iconv-lite';
import cors from 'cors';

const app = express();
app.use(cors());

// 핵심: 바이너리 데이터 받기 위해 raw로 설정!
app.use(express.raw({ type: '*/*', limit: '2mb' }));

app.post('/convert', (req, res) => {
  try {
    const converted = iconv.decode(req.body, 'euc-kr');
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(converted);
  } catch (err) {
    console.error('❌ 변환 오류:', err);
    res.status(500).json({ error: '변환 실패', detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ EUC-KR → UTF-8 변환 서버 실행 중 (포트: ${PORT})`);
});