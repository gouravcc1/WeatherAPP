import React from 'react'
const REACT_APP_API_KEY = '91be0d62116f855eb19b8872a202024e';
import Input from './Input';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './WeatherBox.css'
import WeatherReport from './WeatherReport';
function WeatherBox() {
  const [degrees, setDegrees] = useState(null)
  const [location, setLocation] = useState("Indore")
  const [userLocation, setuserLocation] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("")
  const [humidity, setHumidity] = useState(null)
  const [wind, setWind] = useState(null)
  const [country, setCountry] = useState("")
  const [dataFetched, setDataFetched] = useState(false)
  const [degreesFahrenheit, setDegreesFahrenheit] = useState(null);
  const [unit, setUnit] = useState('Celsius');
  const [recentSearches, setRecentSearches] = useState([]);


  const fetchData = async (e) => {
    
    e.preventDefault()

    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${userLocation}&appid=${REACT_APP_API_KEY}&units=metric`)
      const data = await res.data

      setDegrees(data.main.temp)
      setLocation(data.name)
      setDescription(data.weather[0].description)
      setIcon(data.weather[0].icon)
      setHumidity(data.main.humidity)
      setWind(data.wind.speed)
      setCountry(data.sys.country)
      setDataFetched(true)
      updateRecentSearches(userLocation);

    } catch (err) {
      console.log(err)
      alert("Please enter a valid location")
    }

  }
  const updateRecentSearches = (city) => {
    // Update recent searches list
    if (city != recentSearches[0]) {
      const updatedSearches = [city, ...recentSearches.slice(0, 4)]; // Add new city to the beginning, limit to 5 searches
      setRecentSearches(updatedSearches);


      // Update local storage
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    }
  };

  const defaultDataFetched = async () => {
    if (!dataFetched) {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=accra&appid=${REACT_APP_API_KEY}&units=metric`)
      const data = await res.data


      setDegrees(data.main.temp)
      setDegreesFahrenheit((data.main.temp * 9) / 5 + 32);
      setLocation(data.name)
      setDescription(data.weather[0].description)
      setIcon(data.weather[0].icon)
      setHumidity(data.main.humidity)
      setWind(data.wind.speed)
      setCountry(data.sys.country)
    }

  }
  useEffect(() => {
    // Load recent searches from local storage on component mount
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  useEffect(() => {
    defaultDataFetched()
  }, [])
  const toggleUnit = () => {
    setUnit(unit === 'Celsius' ? 'Fahrenheit' : 'Celsius');
  };
  return (
    <div className='weatherBOX'>
      <div className='weather'>

        <Input
          text={(e) => setuserLocation(e.target.value)}
          submit={fetchData}
          func={fetchData}
        />

        <div className='weather_display'>
          <h3 className='weather_location'>Weather in {location}</h3>

          <div className='temp'>
            <h1 className="weather_degrees">
              {unit === 'Celsius' ? `${degrees} °C` : `${degreesFahrenheit} °F`}
            </h1>
            <button onClick={toggleUnit} className='changeButton'>To {unit === 'Celsius' ? `°F` : `°C`}</button>
          </div>

          <div className='weather_description'>
            <div >
              <div className='weather_description_head'>
                <span className='weather_icon'>
                  <img src={`http://openweathermap.org/img/w/${icon}.png`} alt="weather icon" />
                </span>
                <h3>{description}</h3>
              </div>

              <h3>Humidity: {humidity}%</h3>
              <h3>Wind speed: {wind} m/s</h3>
            </div>

            <div className='weather_country'>
              <h3>{country}</h3>
              <h2 className='weather_date'>{Date().substring(0, 16)}</h2>
            </div>
          </div>


        </div>

      </div>

      <WeatherReport location={userLocation} unit={unit} />
      <div className="recent_searches">
        <h2>Recent Searches:</h2>
        <ul>
          {recentSearches.map((search, index) => (
            <li key={index}>{search}</li>
          ))}
        </ul>
      </div>
    </div>
  )

}

export default WeatherBox;