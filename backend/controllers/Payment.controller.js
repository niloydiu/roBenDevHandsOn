// Mock Stripe Checkout Session controller
export const createCheckoutSession = async (req, res) => {
  try {
    const { amount, eventId, successUrl, cancelUrl } = req.body;
    const userId = req.user._id;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    // Generate a mock checkout URL and session ID
    const sessionId = "mock_session_" + Math.random().toString(36).substring(2, 15);
    const mockCheckoutUrl = `${successUrl}?session_id=${sessionId}&amount=${amount}&eventId=${eventId || ""}`;

    return res.status(200).json({
      success: true,
      sessionId,
      url: mockCheckoutUrl,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId || !sessionId.startsWith("mock_session_")) {
      return res.status(400).json({ success: false, message: "Invalid session ID" });
    }

    // Award volunteer points for donation (e.g. 10 points per dollar)
    const userId = req.user._id;
    req.user.points = (req.user.points || 0) + 100;
    await req.user.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully! 100 points awarded.",
      points: req.user.points,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
