export default async function handler(req, res) {
  const { url, ...params } = req.query;
  
  if (!url) return res.status(400).json({ error: 'URL is required' });

  // 쿼리 파라미터를 다시 URL로 결합
  const searchParams = new URLSearchParams(params);
  const targetUrl = `${url}?${searchParams.toString()}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WeatherApp/1.0)',
      }
    });

    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json") 
                 ? await response.json() 
                 : await response.text();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}