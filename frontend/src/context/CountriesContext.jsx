// src/context/CountriesContext.js
import { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CountriesContext = createContext();

export const CountriesProvider = ({ children }) => {
  const [countries, setCountries] = useState(() => {
    // Try to load from localStorage on initial mount
    const cached = localStorage.getItem('cachedCountries');
    return cached ? JSON.parse(cached) : [];
  });
  const [isFetchingCountries, setIsFetchingCountries] = useState(false);
  const [lastFetched, setLastFetched] = useState(() => {
    return localStorage.getItem('countriesLastFetched') || null;
  });

  const fetchWeather = async (capital) => {
    try {
      const response = await axios({
        method: 'get',
        url: 'https://api.openweathermap.org/data/2.5/weather',
        params: {
          q: capital,
          appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
          units: 'metric'
        }
      });
      
      return {
        temperature: response.data.main.temp,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
      };
    } catch (error) {
      console.warn(`Weather fetch failed for ${capital}:`, error);
      return {
        temperature: "N/A",
        description: "Weather data unavailable",
        icon: "01d",
      };
    }
  };

  const getBestTimeToVisit = (weather) => {
    const temperature = weather.temperature;
    if (temperature >= 15 && temperature <= 25) {
      return "Spring (March to May) or Autumn (September to November)";
    } else if (temperature > 25) {
      return "Winter (December to February)";
    }
    return "Summer (June to August)";
  };

  const getTravelTips = (region) => {
    // Your existing getTravelTips function...
    // (Keep the same switch statement as in your original code)
  };

  const fetchCountries = useCallback(async (forceFetch = false) => {
    // Check if we have recently fetched data (within last hour) unless forceFetch is true
    const now = new Date().getTime();
    const oneHour = 60 * 60 * 1000; // milliseconds in an hour
    
    if (!forceFetch && lastFetched && (now - parseInt(lastFetched)) < oneHour) {
      return; // Use cached data if it's less than an hour old
    }

    setIsFetchingCountries(true);
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        const response = await axios({
          method: 'get',
          url: 'https://restcountries.com/v3.1/all',
          headers: {
            'Accept': 'application/json',
          },
          timeout: 15000,
        });

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid response format');
        }

        const validCountries = response.data.filter(country => 
          country.capital?.[0] && 
          country.name?.common &&
          country.region
        );

        if (validCountries.length === 0) {
          throw new Error('No valid countries found in response');
        }

        const randomCountries = validCountries
          .sort(() => Math.random() - 0.5)
          .slice(0, 10);

        const countriesWithDetails = await Promise.all(
          randomCountries.map(async (country) => {
            const weather = await fetchWeather(country.capital[0]);
            return {
              ...country,
              weather,
              bestTimeToVisit: getBestTimeToVisit(weather),
              travelTips: getTravelTips(country.region)
            };
          })
        );

        // Update state and cache
        setCountries(countriesWithDetails);
        setLastFetched(now.toString());
        localStorage.setItem('cachedCountries', JSON.stringify(countriesWithDetails));
        localStorage.setItem('countriesLastFetched', now.toString());
        break;

      } catch (error) {
        console.error(`Fetch attempt ${retryCount + 1} failed:`, error);
        retryCount++;

        if (retryCount === maxRetries) {
          toast.error("Unable to load countries. Please try again later.");
        } else {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        }
      }
    }
    
    setIsFetchingCountries(false);
  }, [lastFetched]);

  const refreshCountries = () => {
    return fetchCountries(true); // Force fetch new data
  };

  return (
    <CountriesContext.Provider value={{
      countries,
      isFetchingCountries,
      fetchCountries,
      refreshCountries
    }}>
      {children}
    </CountriesContext.Provider>
  );
};

export const useCountries = () => {
  const context = useContext(CountriesContext);
  if (context === undefined) {
    throw new Error('useCountries must be used within a CountriesProvider');
  }
  return context;
};