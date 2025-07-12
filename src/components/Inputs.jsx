import React, { useState } from 'react';
import { BiSearch, BiCurrentLocation } from "react-icons/bi";

const Inputs = ({ setQuery, setUnits }) => {
    const [city, setCity] = useState('');

    // Handle city search
    const handleSearchClick = () => {
        if (city !== '') setQuery({ q: city });
    };

    // Handle current location button click
    const handleLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                setQuery({ q: `${lat},${lon}` });
            });
        }
    };

    return (
        <div className="flex flex-row justify-center my-6">
            <div className='flex flex-row w-3/4 items-center justify-center gap-4'>

                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearchClick();
                    }}
                    placeholder='search by city ....'
                    className="text-gray-500 bg-white text-xl font-light p-1.5 px-5 w-full shadow-xl capitalize focus:outline-none placeholder:lowercase rounded-3xl"
                />

                {/* Search Icon with Tooltip */}
                <div className="relative group">
                    <BiSearch
                        size={30}
                        onClick={handleSearchClick}
                        className='cursor-pointer transition ease-out hover:scale-125'
                    />
                    <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-sm text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                        Search
                    </span>
                </div>

                {/* Current Location Icon with Tooltip */}
                <div className="relative group">
                    <BiCurrentLocation
                        size={30}
                        onClick={handleLocationClick}
                        className='cursor-pointer transition ease-out hover:scale-125'
                    />
                    <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-sm text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                        Current Location
                    </span>
                </div>

            </div>
        </div>
    );
};

export default Inputs;
