"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null);
      setShowInstall(false);
    });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (!input.trim()) {
      alert("행복했던 일을 적어주세요!");
      return;
    }

    setResult(null);

    try {
      const res = await fetch("/api/fortune", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      setResult(data.message);
    } catch (error) {
      console.error(error);
      alert("소확행 지수를 가져오는 데 실패했어요.");
    }
  };

  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 text-gray-900 p-6 text-center">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">오늘의 소확행 지수 ✨</h1>

        {showInstall && (
            <button onClick={handleInstall} className="fixed bottom-4 px-4 py-2 bg-green-500 text-white rounded">
              앱 설치하기 📱
            </button>
        )}

        {!result && (
            <div className="flex flex-col items-center w-full max-w-md">
          <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="오늘 당신을 행복하게 만든 일을 짧게 적어주세요 ✍️"
              className="w-full h-28 md:h-32 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base md:text-lg"
              maxLength={100}
          />
              <button
                  onClick={handleSubmit}
                  className="mt-6 px-8 py-4 bg-yellow-400 rounded-full hover:bg-yellow-500 active:scale-95 font-semibold transition text-lg md:text-xl"
              >
                소확행 지수 측정하기
              </button>
            </div>
        )}

        {result && (
            <div className="flex flex-col items-center">
              <p className="text-xl md:text-2xl font-bold mb-4">{result}</p>
              <button
                  onClick={() => setResult(null)}
                  className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 font-semibold transition"
              >
                다시 하기
              </button>
            </div>
        )}
      </div>
  );
}
