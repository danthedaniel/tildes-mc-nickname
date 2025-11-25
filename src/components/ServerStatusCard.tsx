import { FallbackServerIcon } from "../icons/FallbackServerIcon";
import { useServerContext } from "./ServerContext";
import type { TextComponent } from "../util/tellraw";

function flattenComponent(component: TextComponent): string {
  if (typeof component === "string") {
    return component;
  } else if (typeof component === "number") {
    return component.toString();
  } else if (Array.isArray(component)) {
    return component.map(flattenComponent).join("");
  } else if (typeof component === "object") {
    return component.text;
  }

  throw new Error("Unreachable!");
}

interface ServerIconProps {
  favicon?: string;
}

function ServerIcon({ favicon }: ServerIconProps) {
  if (!favicon) {
    return <FallbackServerIcon className="w-16 h-16" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={favicon}
      alt="Server icon"
      className="w-16 h-16 rounded"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

export function ServerStatusCard() {
  const { serverData } = useServerContext();

  const status = serverData.online ? serverData.status : null;
  const version = status?.version?.name ?? "??.??.??";

  return (
    <div className="relative p-6 pr-10 border border-gray-300 bg-white rounded-lg shadow-md max-w-md w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="shrink-0">
          <ServerIcon favicon={status?.favicon} />
        </div>

        <div className="flex flex-col h-full justify-between min-w-0">
          <p className="text-gray-800 font-bold truncate">Java v{version}</p>
          <p className="text-gray-700 truncate">
            {status ? flattenComponent(status.description) : "Server Offline"}
          </p>
          <p className="text-gray-500">
            {status ? status.players.online : "?"} /{" "}
            {status ? status.players.max : "?"} Players
          </p>
        </div>
      </div>
    </div>
  );
}
