import { Oval } from 'react-loader-spinner'; // Importation d'un loader pour l'affichage du chargement
import React, { useState } from 'react';
import axios from 'axios'; // Importation d'axios pour faire des requêtes HTTP
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Pour afficher des icônes
import { faFrown } from '@fortawesome/free-solid-svg-icons'; // Importation d'une icône de tristesse
import './App.css'; // Importation du fichier de style

function Grp204WeatherApp() {
  // Déclaration des états pour la saisie de l'utilisateur, la météo actuelle et les prévisions
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    forecast: null, // Ajout de l'état pour les prévisions météo
    error: false,
  });

  // Fonction pour formater la date
  const toDateFunction = () => {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août',
      'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const WeekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const currentDate = new Date();
    const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    return date;
  };

  // Fonction pour rechercher la météo lorsque l'utilisateur appuie sur "Entrée"
  const search = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Empêche le comportement par défaut du formulaire
      setInput(''); // Réinitialise la saisie de l'utilisateur
      setWeather({ ...weather, loading: true }); // Déclenche le chargement

      // Appel à l'API OpenWeatherMap pour récupérer les données de la météo actuelle
      const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
      const url = 'https://api.openweathermap.org/data/2.5/weather';
      const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast'; // URL pour les prévisions

      try {
        // Appel pour la météo actuelle
        const currentWeatherResponse = await axios.get(url, {
          params: {
            q: input,
            units: 'metric',
            appid: api_key,
          },
        });

        // Appel pour les prévisions météo
        const forecastResponse = await axios.get(forecastUrl, {
          params: {
            q: input,
            units: 'metric',
            appid: api_key,
          },
        });

        // Mise à jour des données de la météo et des prévisions
        setWeather({
          data: currentWeatherResponse.data,
          forecast: forecastResponse.data,
          loading: false,
          error: false,
        });
      } catch (error) {
        // Gère les erreurs en cas de ville non trouvée ou autre problème
        setWeather({ ...weather, data: {}, forecast: null, error: true });
        setInput(''); // Réinitialise la saisie
      }
    }
  };

  return (
    <div className="App">
      <h1 className="app-name">Application Météo grp204</h1>
      {/* Barre de recherche pour la saisie de l'utilisateur */}
      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Entrez le nom de la ville..."
          name="query"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={search} // Déclenche la recherche lorsqu'on appuie sur "Entrée"
        />
      </div>
      {/* Affichage du loader pendant le chargement */}
      {weather.loading && (
        <>
          <Oval type="Oval" color="black" height={100} width={100} />
        </>
      )}
      {/* Affichage d'un message d'erreur si la ville n'est pas trouvée */}
      {weather.error && (
        <>
          <span className="error-message">
            <FontAwesomeIcon icon={faFrown} />
            <span>Ville introuvable</span>
          </span>
        </>
      )}
      {/* Affichage des informations météo actuelles */}
      {weather && weather.data && weather.data.main && (
        <div>
          <h2>{weather.data.name}, {weather.data.sys.country}</h2>
          <span>{toDateFunction()}</span>
          <img src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
            alt={weather.data.weather[0].description} />
          <p>{Math.round(weather.data.main.temp)}°C</p>
          <p>Vitesse du vent : {weather.data.wind.speed} m/s</p>
        </div>
      )}
      {/* Affichage des prévisions météo */}
      {weather.forecast && (
        <div className="forecast-container">
          <h3>Prévisions sur 5 jours</h3>
          <div className="forecast-cards">
            {/* Affiche les prévisions pour les 5 premiers jours */}
            {weather.forecast.list.slice(0, 5).map((day, index) => (
              <div key={index} className="forecast-card">
                <span>{new Date(day.dt_txt).toLocaleDateString('fr-FR', { weekday: 'long' })}</span>
                <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} 
                  alt={day.weather[0].description} />
                <p>{Math.round(day.main.temp)}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Grp204WeatherApp;
