import Link from "next/link";
import { ArrowLeftIcon } from "../icons/ArrowLeftIcon";
import { StatusDot } from "./StatusDot";
import { useServerContext } from "./ServerContext";

interface TitlebarProps {
  showBack?: boolean;
}

export function Titlebar({ showBack }: TitlebarProps) {
  const { serverData } = useServerContext();
  const online = serverData?.online;

  return (
    <header className="bg-white border-b border-gray-300 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8">
            {showBack && (
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700"
                aria-label="Back to home"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
            )}
          </div>
          <Link
            href="/"
            className="text-xl font-bold text-gray-800 hover:text-gray-600"
          >
            Tildes Minecraft
          </Link>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <StatusDot online={online} />
          <span>{online ? "Online" : "Offline"}</span>
        </div>
      </div>
    </header>
  );
}
