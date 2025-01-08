const { OpenAI } = require("openai");

exports.chat = async (req, res) => {
  const { userPrompt } = req.body;
  
  if (!userPrompt) {
    return res.status(400).json({ message: "User prompt is required" });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
      defaultHeaders: {
        'Content-Type': 'application/json'
      }
    });

    // Validate environment variables
    if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_BASE_URL) {
      throw new Error('Missing required environment variables');
    }

    const completion = await openai.chat.completions.create({
      // Use the correct model identifier format
      model: "mistral-7b-instruct-v0.2",  // Changed from mistralai/Mistral-7B-Instruct-v0.2
      messages: [
        {
          role: "system",
          content: "You are a travel agent. Be short and helpful.And also Give your response in proper formatted way,in proper points Bold texts and whatever required. And finally give your complete response in html tags with proper tailwind css applied to it for formatting.",
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 256,
    });

    if (!completion.choices || !completion.choices[0]) {
      throw new Error('Invalid response from API');
    }

    const response = completion.choices[0].message.content;
    return res.status(200).json({ response });
    
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      status: error.status,
      response: error.response?.data,
      stack: error.stack,
      // Add request details for debugging
      requestData: {
        apiKey: process.env.OPENAI_API_KEY ? 'Present' : 'Missing',
        baseURL: process.env.OPENAI_BASE_URL,
        prompt: userPrompt ? 'Present' : 'Missing'
      }
    });
    
    if (error.message.includes('Missing required environment')) {
      return res.status(500).json({ message: "Server configuration error" });
    }
    if (error.status === 400) {
      return res.status(400).json({ 
        message: "Invalid request parameters",
        details: error.message 
      });
    }
    if (error.status === 401) {
      return res.status(401).json({ message: "Authentication error - check API key" });
    }
    
    return res.status(500).json({ 
      message: "Something went wrong", 
      error: error.message,
      details: error.response?.data 
    });
  }
};