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
    
    axios.get('/api/weather', {
  params: {
    url: 'api/typ02/openApi/VilageFcstMsgService/getLandFcst', // 경로 부분
    pageNo: '1',
    numOfRows: '10',
    dataType: 'XML',
    regId: '11A00101'
    // authKey는 서버리스 함수가 내부적으로 붙여줍니다!
  }
});

    res.status(200).json(response.data);
  } catch (error) {
    console.error("API Proxy Error:", error.message);
    res.status(500).json({ error: "기상청 API 호출 중 오류가 발생했습니다." });
  }
}