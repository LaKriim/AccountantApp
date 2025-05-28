// import React, { useState } from "react";
// import UpdatedGeneratedBudget from "../components/updatedBudgetTable/updatedGeneratedBudget"; // Assuming this component renders the budget table

// const ChatPage = () => {
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [budget, setBudget] = useState(null);

//   const sendMessage = async () => {
//     const response = await fetch("http://localhost:5000/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ message: inputMessage }),
//     });

//     const data = await response.json();

//     // Update messages with the AI's response
//     setMessages([...messages, { user: inputMessage, ai: data.response }]);

//     // Update budget with the latest from backend
//     if (data.budget) {
//       setBudget(data.budget);
//     }

//     setInputMessage(""); // Clear input
//   };

//   return (
//     <div>
//       <h1>Budget Chat</h1>

//       <div className="chat-box">
//         {messages.map((msg, index) => (
//           <div key={index}>
//             <p>
//               <strong>User:</strong> {msg.user}
//             </p>
//             <p>
//               <strong>AI:</strong> {msg.ai}
//             </p>
//           </div>
//         ))}
//       </div>

//       <textarea
//         value={inputMessage}
//         onChange={(e) => setInputMessage(e.target.value)}
//         placeholder="Ask about your budget"
//       ></textarea>
//       <button onClick={sendMessage}>Send</button>

//       <h2>Current Budget</h2>
//       {budget ? (
//         <UpdatedGeneratedBudget data={budget} />
//       ) : (
//         <p>No budget available yet. Please start the chat.</p>
//       )}
//     </div>
//   );
// };

// export default ChatPage;
import React, { useState } from "react";
import UpdatedGeneratedBudget from "../components/updatedBudgetTable/updatedGeneratedBudget";

const ChatPage = () => {
  const [messages, setMessages] = useState([]); // Local message history
  const [inputMessage, setInputMessage] = useState("");
  const [budget, setBudget] = useState(null); // Current budget from backend

  // Function to fetch new budget from /ask and reset chat
  const generateNewBudget = async () => {
    const response = await fetch("http://localhost:5000/ask");
    const data = await response.json();

    setBudget(data.ProfitAndLossForecast); // Set new budget
    setMessages([]); // 🔥 Clear local messages
  };

  const sendMessage = async () => {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: inputMessage }),
    });

    const data = await response.json();

    // 🔥 Console log the AI's response
    console.log("AI Response:", data.response);

    setMessages([...messages, { user: inputMessage, ai: data.response }]); // Add to local messages
    setBudget(data.budget); // Update budget if it changed
    setInputMessage(""); // Clear input field
  };

  return (
    <div>
      <h1>Budget Chat</h1>
      <button onClick={generateNewBudget}>Generate New Budget</button>{" "}
      {/* 🔥 Button to call /ask */}
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
      <h2>Current Budget</h2>
      {budget ? (
        <UpdatedGeneratedBudget data={budget} />
      ) : (
        <p>No budget available yet. Click "Generate New Budget" to start.</p>
      )}
    </div>
  );
};

export default ChatPage;
