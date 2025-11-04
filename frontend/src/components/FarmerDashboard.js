import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const FarmerDashboard = () => {
  const [data, setData] = useState([]);
  const [weather, setWeather] = useState({});
  const [advice, setAdvice] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const { t } = useTranslation();
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
        label: `${item} ${t('farmerDashboard.price')}`,
        data: itemData.map(d => d.price),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      }]
    };
  };

  return (
    <div>
      <h2>{t('farmerDashboard.title')}</h2>
      <div>
        <h3>{t('farmerDashboard.marketData')}</h3>
        <table>
          <thead>
            <tr>
              <th>{t('adminDashboard.item')}</th>
              <th>{t('adminDashboard.price')}</th>
              <th>{t('adminDashboard.region')}</th>
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
        <h3>{t('farmerDashboard.priceTrends')}</h3>
        <select onChange={(e) => setSelectedItem(e.target.value)}>
          <option value="">{t('farmerDashboard.selectItem')}</option>
          {[...new Set(data.map(d => d.item))].map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        {selectedItem && <Line data={getChartData(selectedItem)} />}
      </div>
      <div>
        <h3>{t('farmerDashboard.weather')}</h3>
        {weather.main && (
          <p>{t('farmerDashboard.temperature')}: {weather.main.temp}°C, {t('farmerDashboard.humidity')}: {weather.main.humidity}%</p>
        )}
      </div>
      <div>
        <h3>{t('farmerDashboard.advice')}</h3>
        <p>{advice}</p>
      </div>
      <a href="/forum">{t('farmerDashboard.forumLink')}</a>
    </div>
  );
};

export default FarmerDashboard;
