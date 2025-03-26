// 파일명: convert-server.js
import express from 'express';
import iconv from 'iconv-lite';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.text({ type: '*/*' })); // Raw XML text 받기용

app.post('/convert', (req, res) => {
  try {
    // req.body는 깨진 UTF-8로 들어온 EUC-KR 바이너리 문자열
    const rawBuffer = Buffer.from(req.body, 'binary');

    // iconv로 EUC-KR -> UTF-8 디코딩
    const converted = iconv.decode(rawBuffer, 'euc-kr');

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(converted);
  } catch (err) {
    console.error('변환 오류:', err);
    res.status(500).json({ error: '변환 실패', detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 EUC-KR → UTF-8 변환 서버 실행 중 (포트: ${PORT})`);
});
