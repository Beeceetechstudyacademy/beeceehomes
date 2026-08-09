import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const SUGGESTED_QUESTIONS = [
  "What is a C of O?",
  "How do I inspect a property?",
  "What are the payment terms?",
  "How do I post a property?",
];

function getBeeceeAIResponse(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("c of o") || q.includes("certificate of occupancy") || q.includes("land document")) {
    return "A Certificate of Occupancy (C of O) is an official document issued by the state government in Nigeria that proves legal ownership of land. It is the most important land document you should ask for before buying land. For properties that already have a C of O, transferring ownership requires a 'Governor's Consent'. Always verify these documents at the state lands registry to avoid land disputes or fraud.";
  }

  if (q.includes("inspect") || q.includes("inspection") || q.includes("visit")) {
    return "Before renting or buying, always schedule a physical inspection of the property. Check for structural cracks, water pressure, electrical wiring, and the condition of fittings. Go during the day to assess natural light and the neighborhood. Don't be afraid to ask the owner or agent questions about the property's history and maintenance. You can use the 'Call Owner' or 'WhatsApp Owner' buttons on any listing to arrange a visit.";
  }

  if (q.includes("payment") || q.includes("pay") || q.includes("rent cost") || q.includes("price")) {
    return "In Nigeria, rent is typically paid annually (1 or 2 years in advance). When buying, payment is usually made in installments or full, depending on the agreement. Always ensure you receive a proper receipt and a tenancy agreement or sales contract. Never make large payments in cash without legal documentation. It's highly recommended to use a lawyer for property transactions.";
  }

  if (q.includes("post") || q.includes("list") || q.includes("upload") || q.includes("sell my")) {
    return "To post your property on Beecee Homes, click the 'Post Property' button in the header. You'll need to provide the property title, price in Naira (₦), location (State and City), property type, and your contact details. You can also add photos by pasting image URLs. Once submitted, your listing will appear instantly for buyers and tenants to see!";
  }

  if (q.includes("governor") || q.includes("consent")) {
    return "Governor's Consent is a legal document required when you want to transfer ownership of a property that already has a Certificate of Occupancy (C of O). Under the Land Use Act of 1978, all land in a state is vested in the Governor. So, whenever a property with a C of O is sold, the new buyer must obtain the Governor's Consent to make the transaction legal.";
  }

  if (q.includes("survey") || q.includes("surveyor")) {
    return "A survey plan is a document that shows the exact boundaries and size of a piece of land. It is prepared by a registered surveyor. Before buying land, always ask for the survey plan and take it to the surveyor general's office in the state to verify that the land is not under government acquisition or committed for a public project.";
  }

  if (q.includes("agent") || q.includes("fee") || q.includes("commission")) {
    return "In Nigeria, real estate agents typically charge a commission of 5% to 10% of the property's annual rent or sale price. This is usually paid by the tenant or buyer. On Beecee Homes, you contact the property owner directly, which can help you avoid high agent fees. Always clarify who pays the fee before signing any agreement.";
  }

  if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("help")) {
    return "Hello! I'm BeeceeAI, your Nigerian real estate assistant. I can answer questions about land documents (like C of O and Governor's Consent), property inspection tips, payment terms, and how to use this platform. What would you like to know?";
  }

  return "That's a great question! I can help you with topics like land documentation (C of O, Governor's Consent, Survey plans), property inspection tips, payment terms in Nigeria, and how to post or find properties on Beecee Homes. Try asking me about one of those topics, or contact our support team at beeceegroups@gmail.com for specific inquiries.";
}

export function BeeceeAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! I'm BeeceeAI 🤖 — your Nigerian real estate assistant. Ask me anything about land documents, property inspections, or payment terms!",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text?: string) => {
    const message = (text ?? input).trim();
    if (!message) return;

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");

    setTimeout(() => {
      const response = getBeeceeAIResponse(message);
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
    }, 400);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all duration-300 hover:scale-105 hover:bg-emerald-700 hover:shadow-xl ${
          isOpen ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <Sparkles className="h-5 w-5" />
        Ask BeeceeAI
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-96 w-80 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 to-teal-800 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold leading-tight">BeeceeAI</p>
                <p className="text-xs text-emerald-100">Online • Instant Replies</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "rounded-br-sm bg-emerald-600 text-white"
                      : "rounded-bl-sm bg-white text-slate-700 shadow-sm border border-slate-100"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Suggested Questions */}
            {messages.length <= 2 && (
              <div className="space-y-2 pt-2">
                <p className="text-center text-xs text-slate-400">Try asking:</p>
                {SUGGESTED_QUESTIONS.map((sq) => (
                  <button
                    key={sq}
                    onClick={() => handleSend(sq)}
                    className="w-full rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-left text-xs text-emerald-800 transition-colors hover:bg-emerald-100"
                  >
                    {sq}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2 border-t border-slate-100 bg-white p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Type your question..."
              className="flex-1"
            />
            <Button
              onClick={() => handleSend()}
              size="icon"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}