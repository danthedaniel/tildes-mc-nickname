import axios from "axios";
import { JSDOM } from "jsdom";
import { timingSafeEqual } from "crypto";
import { Rcon } from "rcon-client";
import type { NextApiRequest, NextApiResponse } from "next";

import { computeHMAC, slotDuration } from "./hmac";

async function parseBio(tildesUsername: string) {
  const response = await axios.get(`https://tildes.net/user/${tildesUsername}`);
  const dom = new JSDOM(response.data);
  const userBio = dom.window.document.querySelector("div.user-bio")?.textContent ?? "";
  return userBio;
}

async function applyNickname(mcUsername: string, nickname: string) {
  const host = process.env.RCON_HOST;
  if (!host) {
    throw new Error("Server is not configured correctly");
  }

  const password = process.env.RCON_PASSWORD;
  if (!password) {
    throw new Error("Server is not configured correctly");
  }

  const rcon = await Rcon.connect({
    host,
    port: parseInt(process.env.RCON_PORT || "25575"),
    password,
  });

  const color = "#0099CC";
  const response = await rcon.send(`nickother ${mcUsername} <${color}>${nickname}`);
  await rcon.end();
}

type Data =
  | { success: true }
  | { success: false, message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Only POST requests are allowed" });
    return;
  }

  if (req.headers["content-type"] !== "application/json") {
    res.status(400).json({ success: false, message: "Content-Type must be application/json" });
    return;
  }

  const secret = process.env.USERNAME_SECRET ?? "";
  if (!secret) {
    res.status(500).json({ success: false, message: "Server is not configured correctly" });
    return;
  }

  const { mcUsername, tildesUsername } = req.body;
  if (!mcUsername) {
    res.status(400).json({ success: false, message: "Missing mcUsername" });
    return;
  }
  if (!tildesUsername) {
    res.status(400).json({ success: false, message: "Missing tildesUsername" });
    return;
  }

  if (!/^[a-zA-Z0-9_]{3,16}$/.test(mcUsername)) {
    res.status(400).json({ success: false, message: "Invalid \"mcUsername\"" });
    return;
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(tildesUsername)) {
    res.status(400).json({ success: false, message: "Invalid \"tildesUsername\"" });
    return;
  }

  let bio;
  
  try {
    bio = await parseBio(tildesUsername);
  } catch (error) {
    res.status(400).json({ success: false, message: "Could not read user bio" });
    return;
  }

  const hmac = bio.match(/MCValidation:([a-f0-9]{64})/)?.[1] ?? "";
  if (hmac.length !== 64) {
    res.status(400).json({ success: false, message: "Invalid \"MCValidation\"" });
    return;
  }

  // Check if the HMAC matches any of the three possible time slots
  const now = Date.now();
  const hmacMatches = (
    timingSafeEqual(Buffer.from(hmac), Buffer.from(computeHMAC(mcUsername, tildesUsername, now - slotDuration, secret))) ||
    timingSafeEqual(Buffer.from(hmac), Buffer.from(computeHMAC(mcUsername, tildesUsername, now, secret))) ||
    timingSafeEqual(Buffer.from(hmac), Buffer.from(computeHMAC(mcUsername, tildesUsername, now + slotDuration, secret)))
  );

  if (!hmacMatches) {
    res.status(400).json({ success: false, message: "Invalid \"MCValidation\"" });
    return;
  }

  await applyNickname(mcUsername, tildesUsername);

  res.status(200).json({ success: true });
}
