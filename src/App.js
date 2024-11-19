import { Oval } from 'react-loader-spinner';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function Grp204WeatherApp() {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({
    loading: false,
    data: null,
    forecast: null,
    error: false,
  });
  const [isNight, setIsNight] = useState(false); // État pour suivre le mode jour/nuit

  const toDateFunction = () => {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août',
      'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const WeekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const currentDate = new Date();
    const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    return date;
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError);
    } else {
      alert('La géolocalisation n\'est pas supportée par ce navigateur.');
    }
  };

  const handleLocationSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    fetchWeatherByCoordinates(latitude, longitude);
  };

  const handleLocationError = (error) => {
    console.error('Erreur de géolocalisation:', error);
    setWeather({ ...weather, error: true });
  };

  const fetchWeatherByCoordinates = async (latitude, longitude) => {
    setWeather({ ...weather, loading: true });

    const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
    const url = 'https://api.openweathermap.org/data/2.5/weather';

    try {
      const response = await axios.get(url, {
        params: {
          lat: latitude,
          lon: longitude,
          units: 'metric',
          appid: api_key,
        },
      });
      updateTheme(response.data); // Mettre à jour le thème basé sur l'heure locale
      setWeather({
        data: response.data,
        forecast: null,
        loading: false,
        error: false,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des données météo:', error);
      setWeather({ ...weather, data: null, error: true });
    }
  };

  const search = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setInput('');
      setWeather({ ...weather, loading: true });

      const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
      const url = 'https://api.openweathermap.org/data/2.5/weather';

      try {
        const response = await axios.get(url, {
          params: {
            q: input,
            units: 'metric',
            appid: api_key,
          },
        });
        updateTheme(response.data); // Mettre à jour le thème basé sur l'heure locale
        setWeather({
          data: response.data,
          forecast: null,
          loading: false,
          error: false,
        });
      } catch (error) {
        console.error('Erreur lors de la recherche de la météo:', error);
        setWeather({ ...weather, data: null, error: true });
      }
    }
  };

  const updateTheme = (data) => {
    const localTime = new Date((data.dt + data.timezone) * 1000);
    const hour = localTime.getUTCHours();
    setIsNight(hour < 6 || hour > 18); // Mode nuit si avant 6h ou après 18h
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div className={`App ${isNight ? 'night' : 'day'}`}> {/* Classe basée sur le mode jour/nuit */}
      <h1 className="app-name">Application Météo grp204</h1>
      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Entrez le nom de la ville..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={search}
        />
      </div>

      {weather.loading && <Oval type="Oval" color="black" height={100} width={100} />}

      {weather.error && (
        <span className="error-message">
          <FontAwesomeIcon icon={faFrown} />
          <span>Ville introuvable ou problème de géolocalisation</span>
        </span>
      )}

      {weather.data && weather.data.main && (
        <div>
          <h2>{weather.data.name}, {weather.data.sys.country}</h2>
          <span>{toDateFunction()}</span>
          <img
            src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
            alt={weather.data.weather[0].description}
          />
          <p>{Math.round(weather.data.main.temp)}°C</p>
          <p>Vitesse du vent : {weather.data.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default Grp204WeatherApp;
