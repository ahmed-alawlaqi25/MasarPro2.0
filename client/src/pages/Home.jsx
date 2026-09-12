import React from 'react'
import { useTranslation } from 'react-i18next'

const Home = () => {

    const {t, i18n} = useTranslation();

    const changeLangague = (lang) => {
        i18n.changeLanguage(lang);
        document.dir = lang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = lang;
    };

    const languages =[
    {code:"en", name:"English"},
    {code:"ar", name:"العربية"}
    ];
  return (
    <div>
        <div className='relative'>
            <select value={i18n.language} onChange={(e) => changeLangague(e.target.value)}>
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
            </select>
            <h1>{t('welcomeMessage')}</h1>

        </div>
    </div>
  )
}

export default Home