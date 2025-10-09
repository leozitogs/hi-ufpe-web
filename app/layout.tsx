import "../styles/globals.css";
import BottomNavigation from "@/components/BottomNavigation";

export const metadata = {
  title: "UFPE Hub Inteligente",
  description: "Interface simples com chat e navegação inferior"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="min-h-dvh bg-neutral-50 text-neutral-900">
        <main className="mx-auto max-w-3xl p-0 pb-24">{children}</main>
        <BottomNavigation />
      </body>
    </html>
  );
}
