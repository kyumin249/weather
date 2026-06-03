export function getWeatherStateByValue(temp, humidity) {
  const t = parseFloat(temp);
  const h = parseFloat(humidity);

  if (t <= 0) {
    return { status: "Snow", desc: "눈 / 한파", imgSrc: "/assets/snow.jpg" };
  }
  if (h >= 85) {
    return { status: "Drizzle", desc: "흐림 (다습)", imgSrc: "/assets/overcast.jpg" };
  } else if (h >= 55) {
    return { status: "Clouds", desc: "구름많음", imgSrc: "/assets/mostlyCloudy.jpg" };
  } else {
    return { status: "Clear", desc: "맑음 (쾌적)", imgSrc: "/assets/sunny.jpg" };
  }
}