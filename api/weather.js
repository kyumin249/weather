import axios from 'axios';

export default async function handler(req, res) {
  // 클라이언트에서 전달한 쿼리 파라미터 추출
  const { url, ...queryParams } = req.query;
  
  // Vercel 환경 변수에서 인증키 로드
  const apiHubKey = process.env.VITE_APIHUB_KEY;

  if (!url) {
    return res.status(400).json({ error: "URL 파라미터가 누락되었습니다." });
  }

  try {
    const targetUrl = `https://apihub.kma.go.kr/${url}`;
    
    const response = await axios.get(targetUrl, {
      params: { 
        ...queryParams, 
        authKey: apiHubKey 
      },
      headers: { 
        'Referer': 'https://apihub.kma.go.kr/',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("API Proxy Error:", error.message);
    res.status(500).json({ error: "기상청 API 호출 중 오류가 발생했습니다." });
  }
}