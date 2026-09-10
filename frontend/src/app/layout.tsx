import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeQuest RPG — Turn Software Engineering Into An Addictive RPG",
  description: "Dopamine-driven coding RPG platform with real-time level-ups, evolutionary avatars, weekly bosses, virtual pets, and skill trees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#070913] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
