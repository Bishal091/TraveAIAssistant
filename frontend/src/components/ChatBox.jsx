import { motion } from "framer-motion";
import DOMPurify from 'dompurify';

const ChatBox = ({ userPrompt, setUserPrompt, aiResponse, handleSubmit, isSubmitting }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto "
    >
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Ask me anything about travel..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Asking..." : "Ask"}
        </button>
      </form>
      {aiResponse && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4"
        >
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(aiResponse) 
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatBox;