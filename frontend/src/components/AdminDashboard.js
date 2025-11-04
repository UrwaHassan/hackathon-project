import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [item, setItem] = useState('');
  const [price, setPrice] = useState('');
  const [region, setRegion] = useState('');
  const { t } = useTranslation();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/market-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/market-data', { item, price, region }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      setItem('');
      setPrice('');
      setRegion('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/market-data/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>{t('adminDashboard.title')}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder={t('adminDashboard.item')} value={item} onChange={(e) => setItem(e.target.value)} required />
        <input type="number" placeholder={t('adminDashboard.price')} value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input type="text" placeholder={t('adminDashboard.region')} value={region} onChange={(e) => setRegion(e.target.value)} required />
        <button type="submit">{t('adminDashboard.addButton')}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>{t('adminDashboard.item')}</th>
            <th>{t('adminDashboard.price')}</th>
            <th>{t('adminDashboard.region')}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(d => (
            <tr key={d._id}>
              <td>{d.item}</td>
              <td>{d.price}</td>
              <td>{d.region}</td>
              <td><button onClick={() => handleDelete(d._id)}>{t('adminDashboard.delete')}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
