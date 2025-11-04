import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, password, role });
      navigate('/');
    } catch (err) {
      alert(t('register.failed'));
    }
  };

  return (
    <div>
      <h2>{t('register.title')}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder={t('register.username')} value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder={t('register.password')} value={password} onChange={(e) => setPassword(e.target.value)} required />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="farmer">{t('register.farmer')}</option>
          <option value="admin">{t('register.admin')}</option>
        </select>
        <button type="submit">{t('register.button')}</button>
      </form>
    </div>
  );
};

export default Register;
