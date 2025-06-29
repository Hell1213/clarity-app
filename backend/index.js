const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();

//main backend file
// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-domain.com"]
        : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "Clarity backend is running",
  });
});

// Main emotion analysis endpoint
app.post("/api/analyze", async (req, res) => {
  const { text } = req.body;

  // Validation
  if (!text) {
    return res.status(400).json({
      error: "No text provided",
      message: "Please provide journal text for analysis",
    });
  }

  if (text.length > 2000) {
    return res.status(400).json({
      error: "Text too long",
      message: "Journal entry must be less than 2000 characters",
    });
  }

  try {
    console.log(`Analyzing journal entry: ${text.substring(0, 100)}...`);

    const systemPrompt = `You are a helpful wellness assistant that analyzes journal entries for emotional state and provides supportive suggestions. 
    
    Analyze the given journal entry and return ONLY a JSON object with exactly these two fields:
    - "mood": one of these values: "happy", "sad", "angry", "anxious", "tired", "neutral", "excited", "calm"
    - "suggestion": a brief, supportive suggestion (max 100 characters)
    
    Be empathetic and supportive in your analysis.`;

    const userPrompt = `Analyze this journal entry: "${text}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 150,
      temperature: 0.3, // Lower temperature for more consistent results
    });

    const responseText = completion.choices[0].message.content.trim();
    console.log(`OpenAI response: ${responseText}`);

    // Parse JSON response
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0]);
        } catch (secondParseError) {
          console.error("Second JSON parse error:", secondParseError);
          throw new Error("Could not parse OpenAI response as JSON");
        }
      } else {
        throw new Error("No valid JSON found in OpenAI response");
      }
    }

    // Validate the result structure
    if (!result.mood || !result.suggestion) {
      throw new Error("Invalid response structure from OpenAI");
    }

    // Ensure mood is one of the expected values
    const validMoods = [
      "happy",
      "sad",
      "angry",
      "anxious",
      "tired",
      "neutral",
      "excited",
      "calm",
    ];
    if (!validMoods.includes(result.mood.toLowerCase())) {
      result.mood = "neutral"; // Default fallback
    }

    console.log(
      `Analysis complete: mood=${result.mood}, suggestion=${result.suggestion}`
    );
    res.json(result);
  } catch (error) {
    console.error("Error in /api/analyze:", error);

    if (error.status === 401) {
      return res.status(500).json({
        error: "OpenAI API key invalid",
        message: "Please check your OpenAI API configuration",
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        message: "Too many requests to OpenAI. Please try again later.",
      });
    }

    res.status(500).json({
      error: "Failed to analyze emotion",
      message:
        "An error occurred while analyzing your journal entry. Please try again.",
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong on the server",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: "The requested endpoint does not exist",
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Clarity backend server running on port ${PORT}`);
  console.log(
    `📝 Journal analysis endpoint: http://localhost:${PORT}/api/analyze`
  );
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});
