import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageModal.css';

const LanguageModal = ({ isOpen, onClose, onSelectLanguage }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleLanguageSelect = (lang) => {
    onSelectLanguage(lang);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{t('languageModal.title')}</h2>
        <button onClick={() => handleLanguageSelect('en')}>
          {t('languageModal.english')}
        </button>
        <button onClick={() => handleLanguageSelect('ur')}>
          {t('languageModal.urdu')}
        </button>
      </div>
    </div>
  );
};

export default LanguageModal;
