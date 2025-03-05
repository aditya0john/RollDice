"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

function Hero() {
  const [profit, setProfit] = useState(0); // shows profit
  const [bet, setBet] = useState<number>(10); // shows what you bet
  const [mp, setMp] = useState("0x"); // multiplier status holder
  const [rollResult, setRollResult] = useState(null); // result of the dice roll
  const [balance, setBalance] = useState(10000); // maintains balance
  const [hash, setHash] = useState(""); // gets the SHA-256 code
  const [winLoss, setWinLoss] = useState({ win: false, loss: false }); // shows whether you win or lost a bet

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCount = localStorage.getItem("balance");
      if (storedCount !== null) {
        setBalance(JSON.parse(storedCount));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("balance", JSON.stringify(balance)); // adds balance to local storage at every balance change
    }
  }, [balance]);

  function multiplier(str: string) {
    if (str == "half" && bet * 0.5 >= 1) {
      setBet(Math.round(bet * 0.5));
      setMp("1/2x");
    } else if (str == "double" && bet * 2 <= Number(balance)) {
      setBet(Math.round(bet * 2));
      setMp("2x");
    } else if (bet * 0.5 <= 1) alert("YOU CANT BET BELOW $1");
    else if (bet * 2 >= Number(balance))
      alert("INSUFFICIENT FUNDS TO DOUBLE YOUR BET");
  }

  const rollDice = async () => {
    try {
      const response = await axios.post("http://localhost:5000/roll-dice", {
        bet,
      });

      const data = response.data;
      if (data.error) {
        alert(data.error);
        return;
      }

      setRollResult(data.roll);
      setHash(data.hash);
      setBalance(data.newBalance);
      setProfit(data.profit);
      setWinLoss((prev) => ({ ...prev, win: data.win, loss: !data.win }));
    } catch (error) {
      console.error("Error rolling dice:", error);
    }
  };

  return (
    <div className="h-full w-full PrmColor flex flex-col-reverse lg:grid lg:grid-cols-[0.8fr_2fr] select-none">
      <div className="relative flex flex-col gap-4 justify-start h-[30%] lg:h-full py-2 px-1">
        <label className="text-xs lg:text-lg font-semibold">BET AMOUNT</label>
        <span className="w-full rounded-lg bg-orange-100/[0.4] p-1 grid grid-cols-[2fr_0.5fr_0.5fr]">
          <input
            value={bet}
            type="number"
            onChange={(e) => {
              if (Number(e.target.value) <= balance)
                setBet(Number(e.target.value));
              else
                alert(
                  "KEEP IN MIND YOU CAN'T ADD MONEY MORE THAN YOU HAVE IN YOUR WALLET"
                );
            }}
            placeholder="$ 0.00"
            className="p-2 rounded-lg border-2 outline-none bg-black/[0.2]"
          />

          <button
            className="flex justify-center items-center cursor-pointer"
            onClick={() => multiplier("half")}
          >
            1/2
          </button>
          <button
            className="flex justify-center items-center border-l-2 cursor-pointer"
            onClick={() => multiplier("double")}
          >
            2x
          </button>
        </span>
        <label className="text-xs lg:text-lg font-semibold">
          PROFIT ON WIN
        </label>
        <span
          className={`w-full p-2 rounded-lg font-bold bg-orange-100/[0.4] flex gap-2 items-center ${
            winLoss.win === true ? "text-green-400" : "text-red-600"
          }`}
        >
          {winLoss.win === true ? "+" : "-"}
          {profit}
        </span>

        <button
          onClick={rollDice}
          className="w-[80%] text-xl font-bold p-2 rounded-lg bg-green-400/[0.4] hover:bg-green-400/[0.8] transform duration-200 cursor-pointer mx-auto"
        >
          ROLL DICE
        </button>
        <div className="h-full flex flex-col gap-2 items-center justify-center font-bold">
          <span className="h-24 w-24 text-7xl SecColor rounded-lg flex items-center justify-center">
            {rollResult}
          </span>
          <span className="text-3xl">ROLL RESULT</span>
        </div>
        <div className="absolute bottom-3  text-[8px]">SHA-256 : {hash}</div>
      </div>
      <div className="h-[70%] lg:h-full py-2 px-1">
        <div className="relative SecColor h-full w-full rounded-lg p-1 grid grid-rows-[2fr_0.5fr]">
          <span className="bg-black/[0.4] text-xl lg:text-2xl rounded-lg p-2 flex items-center justify-center gap-2 max-w-lg font-semibold font-mono absolute top-2 left-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            {balance}
          </span>

          <div className="text flex flex-col items-center justify-center">
            <div className="flex justify-between w-[80%] px-4">
              {[0, 25, 50, 75, 100].map((item, i) => (
                <div key={i} className="font-bold text-xl">
                  {item}
                </div>
              ))}
            </div>
            <div className="SecColor w-[80%] h-12 rounded-full flex items-center justify-start overflow-hidden">
              <div className="bg-green-400/[0.8] w-[40%] h-12 rounded-r-full transform duration-300" />
            </div>
          </div>

          <div className="flex items-center justify-center p-4">
            <div className="SecColor rounded-lg w-full h-full p-2 flex gap-6 justify-between uppercase">
              <span className="flex flex-col items-start justify-center w-full">
                <label className="font-semibold text-xl">Multiplier</label>
                <span className="bg-black/[0.4] w-full p-4 rounded-lg">
                  {mp}
                </span>
              </span>
              <span className="flex flex-col items-start justify-center w-full">
                <label className="font-semibold text-xl">Roll Over</label>
                <span className="bg-black/[0.4] w-full p-4 rounded-lg">
                  {"50.00%"}
                </span>
              </span>
              <span className="flex flex-col items-start justify-center w-full">
                <label className="font-semibold text-xl">Win Chance</label>
                <span className="bg-black/[0.4] w-full p-4 rounded-lg">
                  {"49.500"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
