"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const conversations = [
  { name: "Elena Rivera", avatar: "/images/avatars/avatar-1.png", preview: "Hey! Ready for our design session tomorrow?", time: "5m", unread: true },
  { name: "Marcus Thorne", avatar: "/images/avatars/avatar-2.png", preview: "Thanks for the Spanish resources!", time: "2h", unread: false },
  { name: "James Chen", avatar: "/images/avatars/avatar-3.png", preview: "The guitar tabs you sent were perfect", time: "1d", unread: false },
  { name: "Yuki Tanaka", avatar: "/images/avatars/avatar-4.png", preview: "Can we reschedule to Thursday?", time: "2d", unread: true },
];

export default function MessagesPage() {
  return (
    <>
      <Navbar activeTab="messages" />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg min-h-screen">
        <h1 className="text-headline-md font-headline-md mb-stack-lg">Messages</h1>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl whisper-shadow divide-y divide-outline-variant/20">
          {conversations.length === 0 ? (
            <p className="p-stack-lg text-body-md text-on-surface-variant text-center">
              No messages yet. Start a session to connect with someone!
            </p>
          ) : (
            conversations.map((chat) => (
              <div
                key={chat.name}
                className="flex items-center gap-stack-md p-4 hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-outline-variant/30">
                  <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-body-md font-bold text-on-surface truncate">{chat.name}</span>
                    <span className="text-label-caps text-on-surface-variant shrink-0">{chat.time}</span>
                  </div>
                  <p className="text-body-md text-on-surface-variant truncate">{chat.preview}</p>
                </div>
                {chat.unread && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                )}
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
