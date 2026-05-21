import { getWeatherStateByValue, dummyCurrentWeather} from '../../weatherDummy';
import './main.css';
function Main() {
    const currentTemp = dummyCurrentWeather.main.temp;
    const currentHumidity = dummyCurrentWeather.main.humidity;
    const currentWeatherResult = getWeatherStateByValue(currentTemp, currentHumidity);
  return (
    <main>
      <h3>Weather Forecast</h3> 

      <span className={`weather-status ${currentWeatherResult.status}`}>
        {currentWeatherResult.desc}
      </span>
      <div className="forecast-details">
        <p className="detail-temp">{currentTemp}°C</p>
        <p className="detail-humidity">습도: {currentHumidity}%</p>
      </div>
      <img className="forecast-image" src={currentWeatherResult.imgSrc} alt={currentWeatherResult.desc} />
    </main>
  );
}

export default Main;