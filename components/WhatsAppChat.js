import Link from "next/link";

export function WhatsAppChat() {
  const phone = "233599053695";
  const text = encodeURIComponent("Hello Da Essence, I would like to make an inquiry.");
  const href = `https://wa.me/${phone}?text=${text}`;

  return (
    <Link href={href} className="whatsapp-chat" target="_blank" rel="noopener noreferrer" aria-label="Chat with Da Essence on WhatsApp">
      <span className="whatsapp-chat-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M19.11 4.89A10 10 0 0 0 3.52 17.02L2 22l5.11-1.48A10 10 0 1 0 19.11 4.89ZM12 20a7.94 7.94 0 0 1-4.04-1.1l-.29-.17-3.03.88.9-2.95-.19-.3A8 8 0 1 1 12 20Zm4.34-5.84c-.24-.12-1.4-.69-1.61-.76-.21-.08-.37-.12-.52.12-.15.23-.58.76-.72.92-.13.15-.26.17-.49.06-.23-.12-.96-.35-1.83-1.13-.67-.6-1.13-1.34-1.26-1.57-.13-.23-.01-.35.1-.47.1-.1.23-.26.35-.4.12-.13.15-.23.23-.38.08-.15.04-.29-.02-.4-.06-.12-.52-1.26-.71-1.73-.19-.45-.39-.39-.52-.39h-.45c-.15 0-.4.06-.61.29-.21.23-.8.78-.8 1.9 0 1.12.82 2.2.94 2.36.12.15 1.61 2.46 3.91 3.45 2.29.98 2.29.66 2.7.62.41-.04 1.31-.53 1.5-1.03.19-.5.19-.93.13-1.02-.07-.09-.23-.15-.47-.27Z"
          />
        </svg>
      </span>
      <span>WhatsApp Chat</span>
    </Link>
  );
}
