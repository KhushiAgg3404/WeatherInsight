import React, { useState, useEffect } from 'react';
import TopButtons from './components/TopButtons';
import Inputs from './components/Inputs';
import TimeandLocation from './components/TimeandLocation';
import TempAndDetails from './components/TempAndDetails';
import Forecast from './components/Forecast';
import getFormattedWeatherData from './services/weatherService';
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  const [query, setQuery] = useState({ q: 'New Delhi' });
  const [units, setUnits] = useState('metric');
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {
    const CityName = query.q ? query.q : "current location";
    toast.info(`Fetching weather data for ${CityName.toUpperCase()}`);
    const data = await getFormattedWeatherData({ ...query, units });
    toast.success(`Fetched weather data for ${data.name},${data.countryCode}`);
    setWeather(data);
    console.log(data);
  };

  useEffect(() => {
    getWeather();
  }, [query, units]);


  const getBackgroundClass = (details) => {
    if (!details) return 'from-sky-500 via-blue-600 to-indigo-700'; // Default clear/cold

    const text = details.toLowerCase();

    if (text.includes('rain')) return 'from-gray-600 via-gray-700 to-gray-900';       // Rainy
    if (text.includes('cloud')) return 'from-slate-400 via-slate-500 to-slate-700';   // Cloudy
    if (text.includes('snow')) return 'from-blue-100 via-blue-300 to-blue-500';       // Snowy
    if (text.includes('thunder')) return 'from-purple-700 via-yellow-500 to-yellow-700'; // Thunderstorm
    if (text.includes('sun') || text.includes('clear')) return 'from-sky-400 via-sky-500 to-blue-600';// Clear sky
    if (text.includes('mist') || text.includes('fog')) return 'from-gray-500 via-gray-600 to-gray-800';     // Foggy 

    return 'from-sky-500 via-blue-600 to-indigo-700'; // Fallback
  };


  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${getBackgroundClass(weather?.details)} flex flex-col items-center`}>

      {/* Top Bar */}
      <div className="w-full flex  text-white text-xl font-semibold tracking-wide text-left py-3 shadow-lg backdrop-blur-md pl-5 items-center">
        <img src="./image.png" alt="" className='w-8' />
        WeatherInsight
      </div>

      {/* Weather Card */}
      <div className="w-full max-w-screen-lg bg-white/10 text-white backdrop-blur-lg rounded-3xl shadow-2xl px-20 py-10 my-6">
        <TopButtons setQuery={setQuery} />
        <Inputs setQuery={setQuery} setUnits={setUnits} />

        {weather && (
          <>
            <TimeandLocation weather={weather} />
            <TempAndDetails weather={weather} />
            <Forecast title="Hourly Forecast" items={weather.hourly} />
            <Forecast title="Daily Forecast" items={weather.daily} />
          </>
        )}
      </div>
        <ToastContainer autoClose={2500} hideProgressBar={true} theme="colored" />
    </div>
  );

};

export default App;
