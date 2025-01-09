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
    });

    // Validate environment variables
    if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_BASE_URL) {
      throw new Error('Missing required environment variables');
    }

    const systemPrompt = `You are a travel agent. Provide responses in HTML format with Tailwind CSS classes. Focus on creating visually appealing, structured content with proper spacing, colors, and responsive design. Include relevant travel information, tips, and recommendations.`;

    const completion = await openai.chat.completions.create({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        {
          role: "system",
          content: systemPrompt,
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
      stack: error.stack,
      requestData: {
        apiKey: process.env.OPENAI_API_KEY ? 'Present' : 'Missing',
        baseURL: process.env.OPENAI_BASE_URL,
        prompt: userPrompt ? 'Present' : 'Missing'
      }
    });
    
    // Improved error handling with specific messages
    if (error.message.includes('Missing required environment')) {
      return res.status(500).json({ message: "Server configuration error" });
    }
    if (error.status === 400) {
      return res.status(400).json({ 
        message: "Invalid request to AI service. Please try again with a different prompt.",
        details: error.message 
      });
    }
    if (error.status === 401) {
      return res.status(401).json({ message: "Authentication error with AI service" });
    }
    
    return res.status(500).json({ 
      message: "Failed to process your request. Please try again.", 
      error: error.message
    });
  }
};
