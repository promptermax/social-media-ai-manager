"use client";

import React, { useState } from "react";

const TABS = ["Ideas", "Trends", "Strategies"];

export function AIAssistant() {
  const [activeTab, setActiveTab] = useState("Ideas");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fetchSuggestions = async () => {
    setLoading(true);
    setSuggestions([]);
    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: activeTab }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (e) {
      setSuggestions(["Error fetching suggestions."]);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">AI Assistant</h2>
      <div className="flex space-x-2 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`px-3 py-1 rounded ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={fetchSuggestions}
        disabled={loading}
      >
        {loading ? "Generating..." : `Get ${activeTab} Suggestions`}
      </button>
      <ul className="list-disc pl-5 space-y-2">
        {suggestions.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
} 