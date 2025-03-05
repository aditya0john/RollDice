// pages/api/roll-dice.js
import { randomBytes, createHash } from "crypto";

let playerBalance = 10000;
let profit = 0;
let win = false;

// Function to generate a provably fair dice roll
const rollDice = () => {
  const roll = Math.floor(Math.random() * 6) + 1;
  const secret = randomBytes(16).toString("hex");
  const hash = createHash("sha256").update(roll + secret).digest("hex");
  return { roll, hash, secret };
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { bet } = req.body;

  if (!bet || bet > playerBalance) {
    return res.status(400).json({ error: "Insufficient balance" });
  }

  const { roll, hash, secret } = rollDice();

  if (roll >= 4) {
    playerBalance += bet * 2;
    profit = bet * 2;
    win = true;
  } else {
    playerBalance -= bet;
    profit = bet;
    win = false;
  }

  return res.json({
    roll,
    hash,
    secret,
    profit,
    win,
    newBalance: playerBalance,
  });
}
