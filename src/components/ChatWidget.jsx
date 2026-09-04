import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Phone, MessageCircle } from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // "chat" or "whatsapp"
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello beautiful! I am your Geets Beauty Consultant. How can I help you glow today? ✨",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickReplies = [
    { text: "🌟 Best Sellers", type: "bestsellers" },
    { text: "🌸 Skincare Routine", type: "routine" },
    { text: "💄 Makeup Tips", type: "makeup" },
    { text: "🚚 Delivery Info", type: "delivery" }
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: messages.length + 1,
      sender: "user",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate bot response after a short delay
    setTimeout(() => {
      let replyText = "";
      const lowerText = text.toLowerCase();

      if (lowerText.includes("bestsellers") || lowerText.includes("best") || lowerText.includes("selling")) {
        replyText = "Our top customer favourites are the Hydrating Glow Serum (Rs. 1,299) and the Daily Sunscreen SPF 50 (Rs. 1,099). Both are lightweight and perfect for Nepali skin types! 🌟";
      } else if (lowerText.includes("routine") || lowerText.includes("skincare")) {
        replyText = "A beautiful everyday routine: 1. Cleanse your skin, 2. Apply our Hydrating Glow Serum, 3. Seal with Rose Glow Face Cream, and 4. Apply SPF 50 Sunscreen. Routine consistent bhaye glow perfect hunxa! 🌸";
      } else if (lowerText.includes("makeup") || lowerText.includes("lipstick") || lowerText.includes("blush")) {
        replyText = "For an instant glow, try our Velvet Matte Lipstick (Rs. 799) paired with our Soft Blush Palette (Rs. 1,499). They are lightweight and blend beautifully! 💄";
      } else if (lowerText.includes("delivery") || lowerText.includes("shipping") || lowerText.includes("kathmandu")) {
        replyText = "We offer FREE delivery inside pokhara Valley on selected orders! It usually takes 24-48 hours. Outside valley courier through coordinate garxa. 🚚";
      } else if (lowerText.includes("price") || lowerText.includes("cost") || lowerText.includes("rs")) {
        replyText = "Our premium products start from just Rs. 699 (Nourishing Hair Oil) up to Rs. 1,499 (Soft Blush Palette). You can check all prices on our Shop page! 💖";
      } else if (lowerText.includes("hi") || lowerText.includes("hello") || lowerText.includes("helo") || lowerText.includes("namaste")) {
        replyText = "Hello! How can I help you today? Feel free to ask about our skincare routine or makeup collections! 🌸";
      } else {
        replyText = "Thank you for reaching out! For instant order bookings or custom cosmetic queries, you can also talk to Geeta directly at +977 9827104869 or click on the WhatsApp tab above! 💬";
      }

      const botMsg = {
        id: messages.length + 2,
        sender: "bot",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  const openWhatsApp = (msg = "") => {
    const phone = "9779827104869";
    const text = encodeURIComponent(msg || "Hi Geeta, I have a question about Geets Beauty Products!");
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  return (
    <div className="chat-widget-container">
      {/* Floating Action Button */}
      <button 
        className={`chat-floating-btn ${isOpen ? "open" : ""}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Live Chat & WhatsApp"
      >
        {isOpen ? <X size={24} /> : (
          <div className="floating-icons">
            <MessageSquare size={24} className="msg-icon" />
            <span className="pulse-ring"></span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window-box animate-scaleIn">
          <div className="chat-window-header">
            <div className="bot-profile-info">
              <div className="bot-avatar">G</div>
              <div>
                <h3>Geets Beauty Help</h3>
                <span className="online-indicator">Online</span>
              </div>
            </div>
            <button className="close-window-btn" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="chat-tabs">
            <button 
              className={`chat-tab-btn ${activeTab === "chat" ? "active" : ""}`}
              onClick={() => setActiveTab("chat")}
            >
              <MessageCircle size={16} /> Live Beauty Chat
            </button>
            <button 
              className={`chat-tab-btn ${activeTab === "whatsapp" ? "active" : ""}`}
              onClick={() => setActiveTab("whatsapp")}
            >
              <Phone size={16} /> WhatsApp Shop
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "chat" ? (
            <div className="chat-body-content">
              {/* Messages List */}
              <div className="chat-messages-container">
                {messages.map((msg) => (
                  <div key={msg.id} className={`chat-message ${msg.sender}`}>
                    <div className="message-bubble">{msg.text}</div>
                    <span className="message-time">{msg.time}</span>
                  </div>
                ))}
                {isTyping && (
                  <div className="chat-message bot typing">
                    <div className="message-bubble">
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="chat-quick-replies">
                {quickReplies.map((qr) => (
                  <button 
                    key={qr.text} 
                    onClick={() => handleSend(qr.text)}
                    className="quick-reply-pill"
                  >
                    {qr.text}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <form 
                className="chat-input-bar" 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputText);
                }}
              >
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button type="submit" aria-label="Send message">
                  <Send size={16} />
                </button>
              </form>
            </div>
          ) : (
            <div className="whatsapp-body-content">
              <div className="whatsapp-promo-card">
                <div className="wa-icon-large">
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 11.859 0c3.166.001 6.141 1.233 8.378 3.469 2.237 2.235 3.469 5.21 3.468 8.378-.003 6.534-5.329 11.86-11.859 11.86-1.996-.001-3.956-.503-5.703-1.46L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45 5.289 0 9.589-4.301 9.591-9.591.002-2.563-1.002-4.97-2.83-6.798-1.827-1.829-4.24-2.831-6.804-2.831-5.29 0-9.59 4.301-9.593 9.591-.001 1.625.434 3.209 1.26 4.606l-.993 3.626 3.714-.974zm13.125-7.391c-.083-.138-.305-.222-.638-.389-.333-.167-1.969-.971-2.273-1.082-.305-.112-.527-.167-.749.167-.222.333-.86 1.082-1.055 1.305-.194.222-.389.25-.721.083-.333-.167-1.405-.518-2.675-1.651-.989-.882-1.657-1.971-1.851-2.304-.194-.333-.021-.513.145-.679.15-.15.333-.389.5-.583.167-.194.222-.333.333-.556.111-.222.056-.417-.028-.583-.083-.167-.749-1.806-1.026-2.472-.271-.653-.546-.565-.749-.575-.193-.01-.416-.01-.638-.01-.222 0-.583.083-.888.417-.305.333-1.165 1.139-1.165 2.778s1.193 3.222 1.36 3.444c.167.222 2.348 3.585 5.69 5.03 1.96.848 2.766.974 3.759.827.604-.09 1.869-.764 2.132-1.463.264-.699.264-1.297.186-1.422z"/>
                  </svg>
                </div>
                <h3>Connect on WhatsApp</h3>
                <p>Chat directly with Geeta for custom skincare recommendations, price details, and fast ordering within Nepal!</p>
              </div>

              <div className="wa-quick-options">
                <p className="wa-label">Select a fast question to ask:</p>
                <button 
                  onClick={() => openWhatsApp("Hi Geeta! I'm interested in ordering some skincare products.")}
                  className="wa-question-btn"
                >
                  🛍️ I want to order beauty products
                </button>
                <button 
                  onClick={() => openWhatsApp("Hi Geeta! Can you recommend a routine for glowing skin?")}
                  className="wa-question-btn"
                >
                  ✨ Ask for beauty/skincare advice
                </button>
                <button 
                  onClick={() => openWhatsApp("Hi Geeta! How much is delivery inside Kathmandu?")}
                  className="wa-question-btn"
                >
                  🚚 Ask about shipping & delivery cost
                </button>
              </div>

              <button 
                onClick={() => openWhatsApp()} 
                className="wa-direct-chat-btn"
              >
                <Phone size={16} /> Open Direct Chat
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
