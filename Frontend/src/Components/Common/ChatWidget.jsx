import { useEffect, useRef, useState } from "react";
import { FaComments, FaPaperPlane, FaRobot, FaTimes } from "react-icons/fa";
import "./ChatWidget.css";
import { buildApiUrl, jsonApiHeaders } from "../../config/api";
import { normalizeEmailInput, validateEmail, validateName } from "../../utils/formValidation";

const CHAT_API = buildApiUrl("Chat");
const SESSION_STORAGE_KEY = "pirnav-chat-session-id";

const fallbackSuggestions = [
  "Development",
  "Staffing",
  "Support",
];

const createSessionId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `pirnav-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const getSessionId = () => {
  if (typeof window === "undefined") {
    return createSessionId();
  }

  const existingSessionId = window.sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (existingSessionId) {
    return existingSessionId;
  }

  const nextSessionId = createSessionId();
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, nextSessionId);
  return nextSessionId;
};

const getFallbackChatReply = (input) => {
  const message = input.toLowerCase();

  if (message.includes("service") || message.includes("development")) {
    return "We support application development, testing and automation, cloud transformation, cybersecurity, AI and data services, plus enterprise consulting.";
  }

  if (message.includes("staff") || message.includes("hiring") || message.includes("team")) {
    return "Yes. Pirnav provides IT staffing and technical teams for development, testing, and support.";
  }

  if (message.includes("support")) {
    return "Our support team will contact you shortly.";
  }

  if (message.includes("project") || message.includes("start") || message.includes("timeline")) {
    return "Most projects start with a short discussion to understand scope, timeline, and team needs. Use the contact page to share your requirement.";
  }

  return "I can help with Pirnav services, staffing, support, project timelines, and contact details. Ask a short question and I will help.";
};

const getChatReplyText = (data) =>
  data?.reply ||
  data?.Reply ||
  data?.message ||
  data?.Message ||
  data?.response ||
  data?.Response ||
  data?.data?.reply ||
  "I could not process that message right now.";

const getChatSuggestions = (data) => {
  const suggestions = data?.suggestions || data?.Suggestions;

  if (Array.isArray(suggestions)) {
    return suggestions.filter(Boolean);
  }

  return [];
};

const parseChatResponse = async (response) => {
  const rawText = await response.text();

  if (!rawText) {
    return {};
  }

  try {
    return JSON.parse(rawText);
  } catch {
    return { reply: rawText };
  }
};

const isNameStep = (step, messages) => {
  const normalizedStep = String(step || "").toLowerCase();
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === "assistant")
    ?.text?.toLowerCase() || "";

  return normalizedStep.includes("name") || lastAssistantMessage.includes("your name");
};

const isEmailStep = (step, messages) => {
  const normalizedStep = String(step || "").toLowerCase();
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === "assistant")
    ?.text?.toLowerCase() || "";

  return (
    normalizedStep.includes("email") ||
    normalizedStep.includes("mail") ||
    lastAssistantMessage.includes("email") ||
    lastAssistantMessage.includes("mail id") ||
    lastAssistantMessage.includes("mail address")
  );
};

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatSuggestions, setChatSuggestions] = useState(fallbackSuggestions);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState("start");
  const bottomRef = useRef(null);
  const sessionIdRef = useRef(getSessionId());

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatMessages, isLoading, isOpen]);

  const resetChatSession = () => {
    const nextSessionId = createSessionId();
    sessionIdRef.current = nextSessionId;

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, nextSessionId);
    }

    setChatMessages([]);
    setChatSuggestions(fallbackSuggestions);
    setCurrentStep("start");
  };

  const requestChatReply = async (message, options = {}) => {
    const { appendUserMessage = true } = options;
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    if (appendUserMessage) {
      setChatMessages((current) => [
        ...current,
        { id: Date.now(), role: "user", text: trimmedMessage },
      ]);
    }

    setChatInput("");

    try {
      setIsLoading(true);

      const response = await fetch(CHAT_API, {
        method: "POST",
        headers: jsonApiHeaders,
        body: JSON.stringify({
          message: trimmedMessage,
          sessionId: sessionIdRef.current,
        }),
      });

      const data = await parseChatResponse(response);

      if (!response.ok) {
        throw new Error(getChatReplyText(data) || "Live chat request failed.");
      }

      const replyText = getChatReplyText(data);
      const nextSuggestions = getChatSuggestions(data);
      const nextStep = data?.step || data?.Step || "done";

      setChatMessages((current) => [
        ...current,
        { id: Date.now() + 1, role: "assistant", text: replyText },
      ]);
      setCurrentStep(nextStep);
      setChatSuggestions(
        nextSuggestions.length > 0
          ? nextSuggestions
          : nextStep === "done"
            ? ["Start again"]
            : []
      );
    } catch (error) {
      setChatMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: `${error.message || "Live chat is unavailable right now."} ${getFallbackChatReply(trimmedMessage)}`,
        },
      ]);
      setChatSuggestions(fallbackSuggestions);
      setCurrentStep("done");
    } finally {
      setIsLoading(false);
    }
  };

  const initializeChat = () => {
    resetChatSession();
    setHasInitialized(true);
    requestChatReply("Hello", { appendUserMessage: false });
  };

  useEffect(() => {
    if (!isOpen || hasInitialized) {
      return;
    }

    initializeChat();
  }, [hasInitialized, isOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedInput = chatInput.trim();

    if (currentStep === "done") {
      initializeChat();
      return;
    }

    if (!trimmedInput) {
      return;
    }

    if (isNameStep(currentStep, chatMessages)) {
      const nameError = validateName(trimmedInput);

      if (nameError) {
        setChatMessages((current) => [
          ...current,
          { id: Date.now(), role: "user", text: trimmedInput },
          {
            id: Date.now() + 1,
            role: "assistant",
            text: "Please enter a valid name with at least 2 letters.",
          },
        ]);
        setChatInput("");
        return;
      }
    }

    if (isEmailStep(currentStep, chatMessages)) {
      const normalizedEmail = normalizeEmailInput(trimmedInput);
      const emailError = validateEmail(normalizedEmail);

      if (emailError) {
        setChatMessages((current) => [
          ...current,
          { id: Date.now(), role: "user", text: trimmedInput },
          {
            id: Date.now() + 1,
            role: "assistant",
            text: emailError,
          },
        ]);
        setChatInput("");
        return;
      }

      requestChatReply(normalizedEmail);
      return;
    }

    requestChatReply(chatInput);
  };

  return (
    <div className={`global-chat-widget ${isOpen ? "global-chat-widget-open" : ""}`}>
      {isOpen ? (
        <div className="global-chat-panel" role="dialog" aria-label="Pirnav AI live chat">
          <div className="global-chat-header">
            <div className="global-chat-title">
              <span className="global-chat-avatar">
                <FaRobot aria-hidden="true" />
              </span>
              <div>
                <strong>Pirnav AI Assistant</strong>
                <p>Quick help for services and project questions</p>
              </div>
            </div>

            <button
              type="button"
              className="global-chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI live chat"
            >
              <FaTimes aria-hidden="true" />
            </button>
          </div>

          <div className="global-chat-messages">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`global-chat-message global-chat-message-${message.role}`}
              >
                <p>{message.text}</p>
              </div>
            ))}

            {isLoading ? (
              <div className="global-chat-message global-chat-message-assistant">
                <p>Typing...</p>
              </div>
            ) : null}

            <div ref={bottomRef} />
          </div>

          {chatSuggestions.length > 0 ? (
            <div className="global-chat-suggestions">
              {chatSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    if (suggestion === "Start again") {
                      initializeChat();
                      return;
                    }

                    requestChatReply(suggestion);
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}

          <form className="global-chat-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Ask about Pirnav services..."
              aria-label="Type your message"
              disabled={isLoading}
            />
            <button type="submit" aria-label="Send message" disabled={isLoading}>
              <FaPaperPlane aria-hidden="true" />
            </button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        className="global-chat-toggle"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Close AI live chat" : "Open AI live chat"}
        title={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <FaTimes aria-hidden="true" /> : <FaComments aria-hidden="true" />}
      </button>
    </div>
  );
}

export default ChatWidget;
