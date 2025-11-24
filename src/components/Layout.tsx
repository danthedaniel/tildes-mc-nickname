import { ReactNode } from "react";
import { Titlebar } from "./Titlebar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  showBack?: boolean;
}

export function Layout({ children, showBack }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Titlebar showBack={showBack} />
      <main className="flex-1 flex flex-col items-center p-4 pt-8 gap-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}
