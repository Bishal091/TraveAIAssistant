const { OpenAI } = require("openai");


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

exports.chat = async (req, res) => {
  const { userPrompt } = req.body;
  // console.log("User prompt:", userPrompt);

  try {
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
console.log(response);

    const response = completion.choices[0].message.content;
    res.status(200).json({ response });
  } catch (error) {
    console.error("OpenAI API error details:", {
      message: error.message, // Error message
      code: error.code, // Error code (if available)
      status: error.status, // HTTP status code (if available)
      response: error.response?.data, // Full response from the API (if available)
    });
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};