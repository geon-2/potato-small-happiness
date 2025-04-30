"use client";

import { useState, useEffect } from "react";
import {formatDate} from "@/app/utils/formatDate";

export default function WriteForm() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState(null);
    const [history, setHistory] = useState({});
    const today = formatDate(new Date());

    useEffect(() => {
        const saved = localStorage.getItem("small-happiness");
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    const saveToLocal = (entry) => {
        const updated = { ...history };
        if (!updated[today]) updated[today] = [];
        updated[today].push(entry);
        setHistory(updated);
        localStorage.setItem("small-happiness", JSON.stringify(updated));
    };

    const handleSubmit = async () => {
        if (!input.trim()) return alert("행복했던 일을 적어주세요!");
        setResult("loading");

        try {
            const res = await fetch("/api/fortune", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ input }),
            });

            const { score, message } = await res.json();

            setResult(score);
            setMessage(message);
            saveToLocal({ input, score, message });
            setInput("");
        } catch (e) {
            alert("문제가 발생했어요");
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md">
      <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="오늘 당신을 행복하게 만든 일을 적어보세요 ✍️"
          className="w-full h-28 p-4 border rounded-lg text-base mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          maxLength={100}
      />
            <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-yellow-400 rounded-full hover:bg-yellow-500 text-lg font-semibold"
            >
                소확행 저장하기
            </button>

            {result && result !== "loading" && (
                <div className="mt-6 bg-white p-4 rounded-lg shadow w-full">
                    <p className="font-semibold">오늘의 결과:</p>
                    <p className="mt-1 text-yellow-600 font-bold text-lg">🟡 {result}점</p>
                    <p className="mt-1 text-gray-800">{message}</p>
                </div>
            )}
        </div>
    );
}
