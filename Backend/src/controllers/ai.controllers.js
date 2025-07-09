const aiServices = require("../services/ai.services");

module.exports.getResponse = async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) {
    return res.status(400).send("Prompt is required");
  }

  try {
    const response = await aiServices(prompt);
    res.send(response);
  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).send("Failed to get AI response.");
  }
};
