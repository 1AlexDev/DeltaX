import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ sender: string; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Set dark mode by default
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setChat((prev) => [...prev, { sender: "You", text: message }]);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        "https://orange-memory-4jj4rxj7jv59h76w7-5000.app.github.dev/chat",
        { message }
      );
      setChat((prev) => [...prev, { sender: "AI", text: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setChat((prev) => [...prev, { sender: "AI", text: "Failed to get a response." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-6 font-sans">
      <div className="w-full max-w-3xl bg-gray-800 shadow-lg rounded-xl p-6">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-4xl font-extrabold text-center text-red-500">DeltaX</h1>
          <p className="text-center text-gray-400 mt-2">
            Your AI-Powered Chat Assistant
          </p>
        </header>

        {/* Chat Container */}
        <div className="flex flex-col gap-4 overflow-y-auto max-h-96 border border-gray-700 rounded-lg p-4 bg-gray-900">
          {chat.map((line, index) => (
            <div
              key={index}
              className={`flex ${
                line.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${
                  line.sender === "You"
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-gray-200"
                } rounded-lg px-4 py-2 max-w-md`}
              >
                <p className="text-sm">{line.sender}</p>
                <p>{line.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-gray-400 text-sm">AI is typing...</div>
          )}
        </div>

        {/* Input and Send Button */}
        <div className="mt-4 flex items-center gap-4">
          <input
            type="text"
            className="flex-grow border border-gray-700 rounded-lg px-4 py-2 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;