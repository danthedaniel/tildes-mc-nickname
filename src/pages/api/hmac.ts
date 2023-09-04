import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

export const slotDuration = 5 * 60 * 1000; // 5 minutes

export function computeHMAC(mcUsername: string, tildesUsername: string, date: number, secret: string) {
  // Round off the timestamp to the nearest slot
  const timestamp = Math.round(date / slotDuration) * slotDuration;

  return crypto.createHmac("sha256", secret)
    .update(`${mcUsername}:${tildesUsername}:${timestamp}`)
    .digest("hex");
}

type Data =
  | { success: true, hmac: string }
  | { success: false, message: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    res.status(200).json({ success: false, message: "Only POST requests are allowed" });
    return;
  }

  if (req.headers["content-type"] !== "application/json") {
    res.status(200).json({ success: false, message: "Content-Type must be application/json" });
    return;
  }

  const secret = process.env.USERNAME_SECRET;
  if (!secret) {
    res.status(200).json({ success: false, message: "Server is not configured correctly" });
    return;
  }

  const { mcUsername, tildesUsername } = req.body;
  if (!mcUsername) {
    res.status(200).json({ success: false, message: "Missing Minecraft username" });
    return;
  }
  if (!tildesUsername) {
    res.status(200).json({ success: false, message: "Missing Tildes username" });
    return;
  }

  if (!/^[a-zA-Z0-9_]{3,16}$/.test(mcUsername)) {
    res.status(200).json({ success: false, message: "Invalid Minecraft username" });
    return;
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(tildesUsername)) {
    res.status(200).json({ success: false, message: "Invalid Tildes username" });
    return;
  }

  const hmac = computeHMAC(mcUsername, tildesUsername, Date.now(), secret);
  res.status(200).json({ success: true, hmac });
}
