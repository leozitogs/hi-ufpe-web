export default function ChatBubble({
  from,
  time,
  children,
}: {
  from: "bot" | "you";
  time?: string;
  children: React.ReactNode;
}) {
  const isYou = from === "you";

  return (
    <div className={`flex ${isYou ? "justify-end" : "justify-start"} items-end gap-2`}>
      {/* avatar bot */}
      {!isYou && (
        <div className="h-7 w-7 rounded-full bg-neutral-300 grid place-items-center text-[11px]">
          🤖
        </div>
      )}

      <div
        className={[
          "inline-block break-words",
          "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm",
          isYou
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-neutral-100 text-neutral-900 rounded-bl-md",
        ].join(" ")}
      >
        {children}
        <div className={`text-[10px] mt-1 ${isYou ? "text-white/80 text-right" : "text-neutral-500"}`}>
          {time ?? "00:00"}
        </div>
      </div>

      {/* avatar usuário */}
      {isYou && (
        <div className="h-7 w-7 rounded-full bg-neutral-300 grid place-items-center text-[11px]">
          👤
        </div>
      )}
    </div>
  );
}