import { useContext, useState, useEffect, useRef } from "react";
import { FaFlag, FaCloudSun, FaCalendarAlt, FaMapMarkerAlt, FaInfoCircle, FaTimes, FaSync } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import ChatBox from "../components/ChatBox";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import { useCountries } from "../context/CountriesContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isSubmittingChat, setIsSubmittingChat] = useState(false);
  const { isLoggedIn, loading } = useContext(AuthContext);
  const { countries, isFetchingCountries, fetchCountries, refreshCountries } = useCountries();
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCountries(); // Will only fetch if cache is expired or empty
  }, [fetchCountries]);



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
      <ChatBox
        userPrompt={userPrompt}
        setUserPrompt={setUserPrompt}
        aiResponse={aiResponse}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmittingChat}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Countries You Can Visit</h2>
          <button
            onClick={refreshCountries}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={isFetchingCountries}
          >
            <FaSync className={isFetchingCountries ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {isFetchingCountries ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader />
          </div>
        ) : countries.length === 0 ? (
          <div className="text-center text-gray-500">No countries available</div>
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

