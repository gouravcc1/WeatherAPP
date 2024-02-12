import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import './WeatherReport.css'
const WeatherReport = (props) => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setlocation] = useState('accra');
  const [unit, setunit] = useState('Celsius');
  const [ispending, setispending] = useState(true);
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  // setlocation(props.location);
  console.log(props);

  useEffect(() => {
    setlocation(props.location);
    setunit(props.unit);
  }, [props.location, props.unit]);
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${location === '' ? "Indore" : location}&appid=91be0d62116f855eb19b8872a202024e`);
        setWeatherData(response.data);
        setispending(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [location, unit]);


  useEffect(() => {
    if (chartContainer.current && weatherData) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      // const celsiusTemperatures = weatherData.list.map(item => {item.main.temp - 273.15});
      const celsiusTemperatures = unit === 'Celsius' ?
        weatherData.list.map(item => item.main.temp - 273.15) :
        weatherData.list.map(item => (item.main.temp - 273.15) * 9 / 5 + 32);

      chartInstance.current = new Chart(chartContainer.current, {
        type: 'line',
        data: {
          labels: weatherData.list.map(item => item.dt_txt.substr(0, 11)),
          datasets: [{
            label: `Temperature (${unit})`,
            data: celsiusTemperatures,
            borderColor: 'rgba(75, 100, 192, 1)',
            backgroundColor: 'rgba(80, 192, 192, 0.2)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    }
  }, [weatherData]);

  return (

    <div className='chardiv'>
      <h2>Temperature Graph </h2>
      {ispending == false ?
        <>
          <canvas ref={chartContainer} width="400" height="200"></canvas>
          <h6>the historical weather data is not free ,Hence i used forcast data for chart representation</h6>
        </>
        : <div>loading</div>
      }
    </div>
  );
};

export default WeatherReport;
