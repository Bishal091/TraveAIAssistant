import { useContext, useState, useEffect, useRef } from "react";
import { FaFlag, FaCloudSun, FaCalendarAlt, FaMapMarkerAlt, FaInfoCircle, FaTimes } from "react-icons/fa";
import axios from "axios";
import http from 'http';
import https from 'https';
import toast from "react-hot-toast";
import ChatBox from "../components/ChatBox";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isFetchingCountries, setIsFetchingCountries] = useState(false);
  const [isSubmittingChat, setIsSubmittingChat] = useState(false);
  const { isLoggedIn, loading } = useContext(AuthContext);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

  const fetchWeather = async (capital) => {
    try {
      const response = await axios({
        method: 'get',
        url: 'https://api.openweathermap.org/data/2.5/weather',
        params: {
          q: capital,
          appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
          units: 'metric'
        },
        timeout: 5000 // 5 second timeout
      });

      if (!response.data || !response.data.main || !response.data.weather?.[0]) {
        throw new Error('Invalid weather data format');
      }

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

  const fetchCountries = async () => {
    setIsFetchingCountries(true);
    try {
      // First try with axios default config
      let response = await axios({
        method: 'get',
        url: 'https://restcountries.com/v3.1/all',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        httpAgent,
        httpsAgent,
        timeout: 10000, // 10 second timeout
      });
      // If the response is not valid, try with cors-anywhere as fallback
      if (!response.data || !Array.isArray(response.data)) {
        const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/https://restcountries.com/v3.1/all';
        response = await axios.get(corsAnywhereUrl, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });
      }

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid API response format');
      }

      // Filter valid countries first
      const validCountries = response.data.filter(country => 
        country?.name?.common &&
        country?.capital?.[0] &&
        country?.region &&
        country?.population &&
        country?.flags?.png
      );

      // Randomly select 10 countries
      const topCountries = validCountries
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);

      const countriesWithDetails = await Promise.all(
        topCountries.map(async (country) => {
          try {
            const weather = await fetchWeather(country.capital[0]);
            return {
              ...country,
              weather,
              bestTimeToVisit: getBestTimeToVisit(weather),
              travelTips: getTravelTips(country.region)
            };
          } catch (error) {
            console.warn(`Failed to process country ${country.name.common}:`, error);
            return null;
          }
        })
      );

      const finalCountries = countriesWithDetails.filter(Boolean);
      
      if (finalCountries.length === 0) {
        throw new Error('No valid country data available');
      }

      setCountries(finalCountries);
    } catch (error) {
      console.error('Countries fetch error:', error);
      toast.error("Failed to load countries. Please refresh the page.");
    } finally {
      setIsFetchingCountries(false);
    }
  };
  useEffect(() => {
    let mounted = true;

    const initializePage = async () => {
      try {
        await fetchCountries();
      } catch (error) {
        console.error('Initialization error:', error);
        if (mounted) {
          toast.error("Failed to initialize page. Please refresh.");
        }
      }
    };

    initializePage();

    return () => {
      mounted = false;
    };
  }, []);


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
    switch (region) {
      case "Europe":
        return "Explore historical landmarks, enjoy local cuisine, and visit museums.";
      case "Asia":
        return "Visit ancient temples, try street food, and explore bustling markets.";
      case "Africa":
        return "Go on a safari, explore national parks, and experience local cultures.";
      case "Americas":
        return "Visit natural wonders, enjoy outdoor activities, and explore vibrant cities.";
      case "Oceania":
        return "Relax on beautiful beaches, explore coral reefs, and enjoy outdoor adventures.";
      case "North America":
        return "Experience diverse landscapes, visit world-class cities, and enjoy outdoor adventures.";
      case "South America":
        return "Explore the Amazon rainforest, visit iconic landmarks, and enjoy lively festivals.";
      case "Central America":
        return "Discover ancient ruins, enjoy tropical rainforests, and experience rich cultural heritage.";
      case "Caribbean":
        return "Relax on stunning beaches, enjoy vibrant festivals, and explore crystal-clear waters.";
      case "Middle East":
        return "Explore ancient history, enjoy vibrant bazaars, and experience rich cultural traditions.";
      case "Southeast Asia":
        return "Visit stunning islands, enjoy delicious street food, and explore lush jungles.";
      case "Central Asia":
        return "Discover Silk Road history, experience nomadic cultures, and explore stunning landscapes.";
      case "Eastern Europe":
        return "Explore medieval castles, enjoy hearty cuisine, and experience rich cultural traditions.";
      case "Western Europe":
        return "Visit iconic landmarks, enjoy gourmet food, and explore charming cities.";
      case "Northern Europe":
        return "Experience the Northern Lights, explore fjords, and enjoy cozy Scandinavian culture.";
      case "Southern Europe":
        return "Relax on Mediterranean beaches, enjoy delicious cuisine, and explore ancient ruins.";
      case "Antarctica":
        return "Experience the pristine wilderness, observe unique wildlife, and marvel at icy landscapes.";
      case "Polar":
        return "Witness the breathtaking auroras, explore icy terrains, and enjoy extreme adventures.";
      default:
        return "Explore local culture, try traditional cuisine, and visit historical landmarks.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      
    if (!isLoggedIn) {
      navigate("/login");
      toast.error("Please log in to use the chat feature.");
      return;
    }
  
    if (!userPrompt.trim()) {
      toast.error("Please enter a question");
      return;
    }
  
    setIsSubmittingChat(true);
    try {
      const response = await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_API_BASE_URL}/api/ai/chat`,
        data: { userPrompt },
        withCredentials: true,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.data && response.data.response) {
        setAiResponse(response.data.response);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to get response. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmittingChat(false);
    }
  };

  const handleLearnMore = (country) => setSelectedCountry(country);
  const closeModal = () => setSelectedCountry(null);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* ChatBox Section */}
 
        <ChatBox
          userPrompt={userPrompt}
          setUserPrompt={setUserPrompt}
          aiResponse={aiResponse}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmittingChat}
        />


      {/* Top 10 Countries Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Countries You can Visit</h2>
        {isFetchingCountries ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {countries.map((country, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1, delay: index * 0.001 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.1 } }}
                className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-center mb-4">
                    <FaFlag className="text-xl text-blue-500 mr-2" />
                    <h3 className="text-xl font-semibold">{country.name.common}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    <FaMapMarkerAlt className="inline-block mr-2" />
                    <strong>Capital:</strong> {country.capital[0]}
                  </p>
                  <p className="text-gray-600 mb-4">
                    <FaCloudSun className="inline-block mr-2" />
                    <strong>Weather:</strong> {country.weather.description} ({country.weather.temperature}°C)
                  </p>
                  <p className="text-gray-600 mb-4">
                    <FaCalendarAlt className="inline-block mr-2" />
                    <strong>Best Time to Visit:</strong> {country.bestTimeToVisit}
                  </p>
                  <p className="text-gray-600 mb-4">
                    <FaInfoCircle className="inline-block mr-2" />
                    <strong>Travel Tips:</strong> {country.travelTips}
                  </p>
                </div>
                <button
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors mt-auto mb-3"
                  onClick={() => handleLearnMore(country)}
                >
                  Learn More
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Learn More */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 xl:w-1/3 p-6 relative"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-red-400 hover:bg-red-600 p-2 rounded-full transition-colors"
              >
                <FaTimes className="text-white" />
              </button>
              <div className="flex items-center mb-4">
                <img
                  src={selectedCountry.flags.png}
                  alt={`${selectedCountry.name.common} Flag`}
                  className="w-8 h-6 mr-2"
                />
                <h2 className="text-2xl font-bold mr-3">{selectedCountry.name.common}</h2>
              </div>
              <p className="text-gray-600 mb-4">
                <strong>Capital:</strong> {selectedCountry.capital[0]}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Region:</strong> {selectedCountry.region}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Population:</strong> {selectedCountry.population.toLocaleString()}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Languages:</strong>{" "}
                {Object.values(selectedCountry.languages || {}).join(", ")}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Currency:</strong>{" "}
                {Object.values(selectedCountry.currencies || {})
                  .map((currency) => currency.name)
                  .join(", ")}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Weather:</strong> {selectedCountry.weather.description} ({selectedCountry.weather.temperature}°C)
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Best Time to Visit:</strong> {selectedCountry.bestTimeToVisit}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Travel Tips:</strong> {selectedCountry.travelTips}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;