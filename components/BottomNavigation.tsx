"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, ChatIcon, CalendarIcon, BellIcon, NotesIcon } from "./icons";

const items = [
  { href: "/", label: "Home", Icon: HomeIcon, badge: 0 },
  { href: "/chat", label: "Chat", Icon: ChatIcon, badge: 0 },
  { href: "/horarios", label: "Horários", Icon: CalendarIcon, badge: 0 },
  { href: "/comunicados", label: "Comunicados", Icon: BellIcon, badge: 3 },
  { href: "/notas", label: "Notas", Icon: NotesIcon, badge: 0 }
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 border-t bg-white">
      <ul className="mx-auto max-w-3xl grid grid-cols-5 gap-1 p-2">
        {items.map(({ href, label, Icon, badge }) => {
          const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
          return (
            <li key={href} className="relative">
              {badge > 0 && (
                <span className="absolute -top-1 right-4 text-[10px] bg-red-600 text-white rounded-full px-1.5 py-0.5">
                  {badge}
                </span>
              )}
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 py-1 rounded-md text-xs ${
                  active ? "text-[var(--brand)] font-semibold" : "text-neutral-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
