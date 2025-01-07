const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

exports.chat = async (req, res) => {
  const { userPrompt } = req.body;
  
  if (!userPrompt) {
    return res.status(400).json({ message: "User prompt is required" });
  }

  try {
    console.log("Sending request to OpenAI with prompt:", userPrompt);
    
    const completion = await openai.chat.completions.create({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
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
      console.error("Invalid response from OpenAI:", completion);
      return res.status(500).json({ message: "Invalid response from AI service" });
    }

    const response = completion.choices[0].message.content;
    console.log("Successful response:", response);
    
    return res.status(200).json({ response });
  } catch (error) {
    console.error("OpenAI API error:", {
      message: error.message,
      code: error.code,
      status: error.status,
      response: error.response?.data,
      stack: error.stack
    });

    // Specific error handling
    if (error.response?.status === 401) {
      return res.status(500).json({ message: "Authentication error with AI service" });
    }
    
    if (error.response?.status === 400) {
      return res.status(400).json({ message: "Invalid request to AI service" });
    }

    return res.status(500).json({ 
      message: "Something went wrong", 
      error: error.message,
      details: error.response?.data 
    });
  }
};