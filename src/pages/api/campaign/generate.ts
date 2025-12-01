import { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";

// Temporary in-memory storage (replace with DB in production)
const usedTokens = new Set<string>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { pluCode } = req.body;

    if (!pluCode) {
      return res.status(400).json({ error: "pluCode is required" });
    }

    // Generate unique one-time token
    const token = randomUUID();

    // Store token (for demo only)
    usedTokens.add(token);

    // Construct booking URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const bookingUrl = `${baseUrl}/booking?plu=${pluCode}&token=${token}`;

    return res.status(200).json({
      pluCode,
      token,
      url: bookingUrl,
    });
  } catch (error) {
    console.error("Error generating campaign URL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
