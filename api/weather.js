import axios from 'axios';

export default async function handler(req, res) {
  const { url, ...queryParams } = req.query;
  const apiHubKey = process.env.VITE_APIHUB_KEY; // Vercel 환경변수 사용

  try {
    // Vercel 서버가 대신 요청 (기상청에서 정상 응답)
    const response = await axios.get(`https://apihub.kma.go.kr/${url}`, {
      params: { ...queryParams, authKey: apiHubKey },
      headers: { 'Referer': 'https://apihub.kma.go.kr/' }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("API Proxy Error:", error.message);
    res.status(500).json({ error: "기상청 호출 실패" });
  }
}