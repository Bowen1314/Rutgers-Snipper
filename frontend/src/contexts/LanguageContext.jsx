import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'zh';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = (key, params = {}) => {
        let text = translations[language][key] || key;

        // Replace parameters like {target}
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });

        return text;
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
