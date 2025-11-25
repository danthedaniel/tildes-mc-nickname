import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { PingResult } from "@/util/mc-ping";

interface ServerContextType {
  serverData: PingResult;
  setServerData: (data: PingResult) => void;
}

const ServerContext = createContext<ServerContextType | null>(null);

interface ServerProviderProps {
  children: ReactNode;
}

const CACHE_KEY = "serverQueryCache";

function loadFromLocalStorage(): PingResult | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    return JSON.parse(cached) as PingResult;
  } catch {
    return null;
  }
}

function saveToLocalStorage(data: PingResult | null): void {
  if (typeof window === "undefined") return;

  try {
    if (data) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(CACHE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export function ServerProvider({ children }: ServerProviderProps) {
  const [serverData, setServerData] = useState<PingResult>({
    online: false,
  });

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    const cached = loadFromLocalStorage();
    if (cached) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setServerData(cached);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToLocalStorage(serverData);
  }, [serverData]);

  return (
    <ServerContext.Provider value={{ serverData, setServerData }}>
      {children}
    </ServerContext.Provider>
  );
}

export function useServerContext(): ServerContextType {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error("useServerContext must be used within a ServerProvider");
  }
  return context;
}
