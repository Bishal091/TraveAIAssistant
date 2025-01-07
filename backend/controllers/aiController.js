const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`, // wrapped in string
  baseURL: `${process.env.OPENAI_BASE_URL}` // wrapped in string
});

exports.chat = async (req, res) => {
  const { userPrompt } = req.body;
  
  if (!userPrompt) {
    return res.status(400).json({ message: "User prompt is required" });
  }

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

    const response = completion.choices[0].message.content;
    return res.status(200).json({ response });
    
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};