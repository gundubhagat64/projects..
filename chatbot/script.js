const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

// Replace with your OpenAI API key
const API_KEY = import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5",
  input: "Write a short bedtime story about a unicorn.",
});

console.log(response.output_text);
;

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

function addMessage(content, className) {
    const msg = document.createElement("div");
    msg.className = `message ${className}`;
    msg.textContent = content;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Display user message
    addMessage(message, "user-message");
    userInput.value = "";

    // Show bot typing animation
    const loadingMsg = document.createElement("div");
    loadingMsg.className = "message bot-message";
    loadingMsg.textContent = "Typing...";
    chatBox.appendChild(loadingMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Call API
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message }]
            })
        });

        const data = await response.json();
        loadingMsg.remove();
        addMessage(data.choices[0].message.content, "bot-message");

    } catch (error) {
        loadingMsg.remove();
        addMessage("Error: Unable to get response. Check API key.", "bot-message");
    }
}
