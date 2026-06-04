import axios from 'axios';

export default async function handler(req, res) {
  const { url, ...queryParams } = req.query;
  const apiHubKey = process.env.VITE_APIHUB_KEY; // Vercel 환경변수

  try {
    const response = await axios.get(`https://apihub.kma.go.kr/${url}`, {
      params: { ...queryParams, authKey: apiHubKey },
      headers: { 'Referer': 'https://apihub.kma.go.kr/' }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "API 호출 실패" });
  }
}