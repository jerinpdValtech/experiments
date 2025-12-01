import { NextApiRequest, NextApiResponse } from "next";

// Use a database in production
const usedTokens = new Set<string>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { plu, token } = req.body;

  if (!plu || !token) {
    return res.status(400).json({ valid: false, error: "Missing parameters" });
  }

  if (usedTokens.has(token)) {
    return res.status(400).json({ valid: false, error: "Token already used" });
  }

  usedTokens.add(token);

  return res.status(200).json({ valid: true });
}
