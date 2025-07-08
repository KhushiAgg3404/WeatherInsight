import React from 'react';

const Forecast = ({ title, items }) => {
  return (
    <div>
      {/* Forecast Title */}
      <div className='flex items-center justify-start mt-6'>
        <p className='font-medium uppercase'>{title}</p>
      </div>

      <hr className="my-1" />

      {/* Forecast Items */}
      <div className='flex items-center justify-between text-white'>
        {items.map((item, index) => (
          <div key={index} className='flex flex-col items-center justify-center'>
            {/* Time for hourly / Day for daily */}
            <p className='font-light text-sm'>{item.time || item.day}</p>

            {/* Weather Icon */}
            <img src={item.icon} alt="weather icon" className='w-12 my-1' />

            {/* Temperature */}
            <p className='font-medium'>{item.temp || item.avg_temp}°</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
