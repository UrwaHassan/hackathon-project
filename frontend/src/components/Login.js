import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageModal from './LanguageModal';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      setShowModal(true);
    } catch (err) {
      alert(t('login.failed'));
    }
  };

  const handleLanguageSelect = (lang) => {
    localStorage.setItem('language', lang);
    window.location.reload(); // Reload to apply language change
  };

  const handleModalClose = () => {
    setShowModal(false);
    const role = localStorage.getItem('role');
    if (role === 'admin') navigate('/admin');
    else navigate('/farmer');
  };

  return (
    <div>
      <h2>{t('login.title')}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder={t('login.username')} value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder={t('login.password')} value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">{t('login.button')}</button>
      </form>
      <p><a href="/register">{t('login.registerLink')}</a></p>
      <LanguageModal isOpen={showModal} onClose={handleModalClose} onSelectLanguage={handleLanguageSelect} />
    </div>
  );
};

export default Login;
