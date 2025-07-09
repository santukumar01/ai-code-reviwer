import aiServices from "../services/ai.services.js"; // ✅ add .js extension for ES Modules

export async function getResponse(req, res) {
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
}
