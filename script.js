const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatContainer = document.getElementById("chat-container");

const DEEPSEEK_API_KEY = "sk-04c76f2a41784a9687806ffe0fc9d790"; // Replace this!

const appendMessage = (sender, text) => {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerText = text;
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
};

const sendToDeepSeek = async (userInput) => {
  appendMessage("user", userInput);

  appendMessage("bot", "Typing...");

  const messages = [
    { role: "system", content: "You are a helpful AI assistant." },
    { role: "user", content: userInput }
  ];

  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messages,
        temperature: 0.7
      })
    });

    const data = await res.json();

    const botReply = data.choices[0].message.content;

    // Remove "Typing..."
    chatContainer.lastChild.remove();

    appendMessage("bot", botReply);
  } catch (err) {
    chatContainer.lastChild.remove();
    appendMessage("bot", "Error: Could not reach DeepSeek API.");
    console.error(err);
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userInput = input.value.trim();
  if (!userInput) return;
  input.value = "";
  sendToDeepSeek(userInput);
});
