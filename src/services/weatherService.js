// src/services/weatherService.js
import { DateTime } from "luxon";
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

const API_KEY = 'c7974061e1e74129b91100154250607';
const BASE_URL = 'https://api.weatherapi.com/v1/';

countries.registerLocale(enLocale);

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + infoType);
  url.search = new URLSearchParams({ ...searchParams, key: API_KEY });
  return fetch(url).then((res) => res.json());
};

const getCountryCode = (countryName) => {
  return countries.getAlpha2Code(countryName, 'en') || countryName;
};

const formatToLocalTime = (
  epochSeconds,
  tz_id,
  format = "cccc, dd LLL yyyy' | Local time:' hh:mm a"
) => {
  return DateTime.fromSeconds(epochSeconds).setZone(tz_id).toFormat(format);
};

const formatCurrent = (data, forecastData, units) => {
  const {
    location: { name, country, lat, lon, localtime_epoch, tz_id },
    current: {
      temp_c,
      temp_f,
      feelslike_c,
      feelslike_f,
      humidity,
      wind_kph,
      wind_mph,
      condition
    }
  } = data;

  const todayForecast = forecastData.forecast.forecastday[0];
  const temp_min = units === 'metric' ? todayForecast.day.mintemp_c : todayForecast.day.mintemp_f;
  const temp_max = units === 'metric' ? todayForecast.day.maxtemp_c : todayForecast.day.maxtemp_f;
  const sunrise = todayForecast.astro.sunrise;
  const sunset = todayForecast.astro.sunset;

  const countryCode = getCountryCode(country);

  return {
    name,
    country,
    countryCode,
    lat,
    lon,
    timezone: tz_id,
    temp: units === 'metric' ? temp_c : temp_f,
    feels_like: units === 'metric' ? feelslike_c : feelslike_f,
    humidity,
    speed: units === 'metric' ? wind_kph : wind_mph,
    details: condition.text,
    icon: `https:${condition.icon}`,
    formattedLocalTime: formatToLocalTime(localtime_epoch, tz_id),
    date: formatToLocalTime(localtime_epoch, tz_id, "dd LLL yyyy"),
    temp_min,
    temp_max,
    sunrise,
    sunset
  };
};

const formatForecastWeather = (data, units) => {
  const { forecastday } = data.forecast;
  const tz_id = data.location.tz_id;

  const daily = forecastday.map(day => {
    const dateTime = DateTime.fromISO(day.date).setZone(tz_id);
    return {
      date: day.date,
      day: dateTime.toFormat("ccc"),
      avg_temp: units === 'metric' ? day.day.avgtemp_c : day.day.avgtemp_f,
      icon: `https:${day.day.condition.icon}`,
    };
  });

  const nowEpoch = DateTime.now().toSeconds();
  const hourly = forecastday
    .flatMap(day => day.hour)
    .filter(hour => hour.time_epoch > nowEpoch)
    .slice(0, 5)
    .map(hour => ({
      time: DateTime.fromSeconds(hour.time_epoch).setZone(tz_id).toFormat("hh:mm a"),
      temp: units === 'metric' ? hour.temp_c : hour.temp_f,
      icon: `https:${hour.condition.icon}`,
    }));

  return { daily, hourly };
};

const getFormattedWeatherData = async (searchParams) => {
  const currentData = await getWeatherData('current.json', searchParams);
  const forecastData = await getWeatherData('forecast.json', {
    ...searchParams,
    days: 5
  });

  const units = searchParams.units || 'metric';
  const formattedCurrentWeather = formatCurrent(currentData, forecastData, units);
  const formattedForecastWeather = formatForecastWeather(forecastData, units);

  return {
    ...formattedCurrentWeather,
    ...formattedForecastWeather
  };
};

export default getFormattedWeatherData;
