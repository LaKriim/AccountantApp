import React, { useState } from "react";
import UpdatedGeneratedBudget from "../components/updatedBudgetTable/updatedGeneratedBudget"; // Import the updated budget table component

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [budget, setBudget] = useState(null);

  const sendMessage = async () => {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: inputMessage }),
    });

    const data = await response.json();

    // Update messages with the AI's response
    setMessages([...messages, { user: inputMessage, ai: data.response }]);

    // Update the budget if it's changed
    if (data.budget) {
      setBudget(data.budget);
    }

    setInputMessage(""); // Clear the input field after sending the message
  };

  return (
    <div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index}>
            <p>
              <strong>User:</strong> {msg.user}
            </p>
            <p>
              <strong>AI:</strong> {msg.ai}
            </p>
          </div>
        ))}
      </div>

      <textarea
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Ask about your budget"
      ></textarea>

      <button onClick={sendMessage}>Send</button>

      {budget && (
        <UpdatedGeneratedBudget data={budget} />
      )}
    </div>
  );
};

export default ChatPage;
