export const fetchLatestValidWeather = async (cityId) => {
  try {
    const response = await axios.get(
      '/api-weather/api/typ01/url/kma_sfctm2.php',
      {
        params: {
          authKey: APIHUB_KEY,
          stn: cityId,
          tm: '202606041300',
          help: '0'
        }
      }
    );

    console.log('ASOS 응답:', response.data);

    return {
      success: true,
      data: response.data
    };
  } catch (err) {
    console.error(err);
  }
};
