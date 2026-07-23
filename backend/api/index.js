import app from "../server.js";

export default async function handler(req, res) {
  try {
    return app(req, res);
  } catch (error) {
    console.error("Vercel serverless handler error:", error);
    return res.status(500).json({
      success: false,
      message: "Serverless handler error",
      error: error.message || String(error)
    });
  }
}
