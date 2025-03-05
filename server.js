import express, { json } from "express";
import { randomBytes, createHash } from "crypto";
import cors from "cors";

const app = express();
app.use(json());
app.use(cors());

let playerBalance = 10000;
let profit = 0;
let win = false;


// Function to generate a provably fair dice roll
const rollDice = () => {
  const roll = Math.floor(Math.random() * 6) + 1; // Random number (1-6)
  const secret = randomBytes(16).toString("hex"); // Secret for fairness
  const hash = createHash("sha256")
    .update(roll + secret)
    .digest("hex"); // Generate hash

  return { roll, hash, secret };
};

app.post("/roll-dice", (req, res) => {
  const { bet } = req.body; // Default if no balance sent

  if (bet > playerBalance) {
    return res.status(400).json({ error: "Insufficient balance" });
  }

  const { roll, hash, secret } = rollDice();

  // Update balance: if chosenNumber matches roll, player wins
  if (roll >= 4) {
    playerBalance += bet * 2;
    profit = bet * 2;
    win = true;
   
  } else {
    playerBalance -= bet;
    profit = bet;
    win = false;
   
  }

  res.json({
    roll,
    hash,
    secret,  // To verify fairness
    profit,
    win,
    newBalance: playerBalance,
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
