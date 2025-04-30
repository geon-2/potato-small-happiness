"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {formatDate} from "@/app/utils/formatDate";
import { supabase } from "../lib/supabase";
import {getUserId} from "@/app/utils/getUserId";

export default function CalendarView() {
    const [history, setHistory] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("small-happiness");
        if (saved) setHistory(JSON.parse(saved));
        setIsLoaded(true);
    }, []);

    const handleDateClick = (date) => {
        const yyyyMMdd = formatDate(date);
        setSelectedDate(yyyyMMdd);
    };

    const getAverageScore = (dateString) => {
        const entries = history[dateString];
        if (!entries || entries.length === 0) return null;

        const scores = entries
            .map((e) => (typeof e.score === "number" ? e.score : null))
            .filter((score) => score !== null);

        if (scores.length === 0) return null;

        return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    };

    const handleDelete = (index) => {
        const updated = { ...history };
        updated[selectedDate].splice(index, 1);
        if (updated[selectedDate].length === 0) delete updated[selectedDate];
        setHistory(updated);
        localStorage.setItem("small-happiness", JSON.stringify(updated));
    };

    const handleBackup = async () => {
        const userId = getUserId();
        const entries = [];
        Object.entries(history).forEach(([date, logs]) => {
            logs.forEach((item) => {
                entries.push({ ...item, date, user_id: userId });
            });
        });
        await supabase.from("happiness_logs").insert(entries);
        alert("백업 완료!");
    };

    const handleRestore = async () => {
        const userId = getUserId();
        const { data, error } = await supabase
            .from("happiness_logs")
            .select("date, input, score, message")
            .eq("user_id", userId);

        if (error) return alert("복원 실패!");

        const restored = {};
        data.forEach((item) => {
            if (!restored[item.date]) restored[item.date] = [];
            restored[item.date].push({
                input: item.input,
                score: item.score,
                message: item.message,
            });
        });

        setHistory(restored);
        localStorage.setItem("small-happiness", JSON.stringify(restored));
        alert("복원 완료!");
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md">
            <div className="flex gap-2 mb-4">
                <button onClick={handleBackup} className="bg-blue-500 text-white px-4 py-2 rounded">☁️ 백업</button>
                <button onClick={handleRestore} className="bg-green-500 text-white px-4 py-2 rounded">📥 복원</button>
            </div>

            {isLoaded && (
                <Calendar
                    locale="ko-KR"
                    className="rounded-lg p-4 shadow bg-white mb-6"
                    onClickDay={handleDateClick}
                    tileContent={({ date }) => {
                        const key = formatDate(date);
                        const avg = getAverageScore(key);
                        return avg ? (
                            <div className="text-xs mt-1 text-yellow-600">{avg}점</div>
                        ) : null;
                    }}
                    tileClassName={({ date }) => {
                        const key = formatDate(date);
                        const avg = getAverageScore(key);
                        if (avg >= 90) return "bg-yellow-300 text-black rounded-md";
                        if (avg >= 70) return "bg-yellow-100 text-black rounded-md";
                        return "";
                    }}
                />
            )}

            {selectedDate && history[selectedDate] && (
                <div className="w-full mt-4">
                    <h2 className="text-lg font-semibold mb-2">{selectedDate} 기록 📖</h2>
                    <ul className="space-y-2 text-left">
                        {history[selectedDate].map((item, i) => (
                            <li key={i} className="border-l-4 border-yellow-400 pl-2 flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-medium">✍️ {item.input}</div>
                                    <div className="text-sm text-yellow-500">🟡 {item.score}점</div>
                                    <div className="text-sm text-gray-700">🌟 {item.message}</div>
                                </div>
                                <button
                                    onClick={() => handleDelete(i)}
                                    className="text-red-500 hover:text-red-700 ml-4"
                                >
                                    ❌
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}


