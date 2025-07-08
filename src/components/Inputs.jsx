import React, { useState } from 'react';
import { BiSearch, BiCurrentLocation } from "react-icons/bi";

const Inputs = ({ setQuery, setUnits }) => {
    const [city, setCity] = useState('');

    // Handle city search
    const handleSearchClick = () => {
        if (city !== '') setQuery({ q: city });
    };

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
            {/* Search Input */}
            <div className='flex flex-row w-3/4 items-center justify-center gap-4'>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder='search by city ....'
                    className="text-gray-500 bg-white text-xl font-light p-1.5 px-5 w-full shadow-xl capitalize focus:outline-none placeholder:lowercase rounded-3xl"
                />

                <BiSearch
                    size={30}
                    className='cursor-pointer transition ease-out hover:scale-125'
                    onClick={handleSearchClick}
                />

                <BiCurrentLocation
                    size={30}
                    className='cursor-pointer transition ease-out hover:scale-125'
                    onClick={handleLocationClick}
                />
            </div>


        </div>

    );
};

export default Inputs;
