import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const FarmerDashboard = () => {
  const [data, setData] = useState([]);
  const [weather, setWeather] = useState({});
  const [advice, setAdvice] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
    fetchWeather();
    fetchAdvice();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/farmer/market-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWeather = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/farmer/weather/Karachi', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWeather(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdvice = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/farmer/advice', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdvice(res.data.advice);
    } catch (err) {
      console.error(err);
    }
  };

  const getChartData = (item) => {
    const itemData = data.filter(d => d.item === item).slice(0, 7);
    return {
      labels: itemData.map(d => new Date(d.date).toLocaleDateString()),
      datasets: [{
        label: `${item} Price`,
        data: itemData.map(d => d.price),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      }]
    };
  };

  return (
    <div>
      <h2>Farmer Dashboard</h2>
      <div>
        <h3>Market Data</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Region</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map(d => (
              <tr key={d._id}>
                <td>{d.item}</td>
                <td>{d.price}</td>
                <td>{d.region}</td>
                <td>{new Date(d.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3>Price Trends</h3>
        <select onChange={(e) => setSelectedItem(e.target.value)}>
          <option value="">Select Item</option>
          {[...new Set(data.map(d => d.item))].map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        {selectedItem && <Line data={getChartData(selectedItem)} />}
      </div>
      <div>
        <h3>Weather</h3>
        {weather.main && (
          <p>Temperature: {weather.main.temp}°C, Humidity: {weather.main.humidity}%</p>
        )}
      </div>
      <div>
        <h3>Advice</h3>
        <p>{advice}</p>
      </div>
      <a href="/forum">Go to Forum</a>
    </div>
  );
};

export default FarmerDashboard;
