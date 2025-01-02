// frontend/src/components/AuthForm.jsx
import { motion } from "framer-motion";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

const AuthForm = ({ type, onSubmit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">{type === "login" ? "Login" : "Signup"}</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {type === "login" ? "Login" : "Signup"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <GoogleOAuthProvider clientId="<your_google_client_id>">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse);
              toast.success("Google login successful");
            }}
            onError={() => {
              toast.error("Google login failed");
            }}
          />
        </GoogleOAuthProvider>
      </div>
    </motion.div>
  );
};

export default AuthForm;