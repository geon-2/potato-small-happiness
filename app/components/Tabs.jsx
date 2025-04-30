"use client";

import { useState } from "react";
import WriteForm from "./WriteForm";
import CalendarView from "./CalendarView";

export default function Tabs() {
    const [tab, setTab] = useState("write");

    const active = "bg-yellow-400 text-white";
    const inactive = "bg-gray-200 text-gray-800";

    return (
        <div className="min-h-screen bg-yellow-50 text-gray-900 p-4 flex flex-col items-center">
            <div className="flex space-x-2 mb-6">
                <button
                    className={`px-4 py-2 rounded-full font-semibold transition ${tab === "write" ? active : inactive}`}
                    onClick={() => setTab("write")}
                >
                    ✍️ 소확행 기록
                </button>
                <button
                    className={`px-4 py-2 rounded-full font-semibold transition ${tab === "view" ? active : inactive}`}
                    onClick={() => setTab("view")}
                >
                    📅 기록 조회
                </button>
            </div>

            {tab === "write" ? <WriteForm /> : <CalendarView />}
        </div>
    );
}
