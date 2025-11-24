import { useEffect, useState } from "react";
import type { ServerQueryResponse } from "../api-types";

const CACHE_KEY = "serverQueryCache";

function getCachedData(): ServerQueryResponse | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    return JSON.parse(cached) as ServerQueryResponse;
  } catch {
    return null;
  }
}

function setCachedData(data: ServerQueryResponse): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

export function useServerStatus() {
  const [serverData, setServerData] = useState<ServerQueryResponse | null>(
    null,
  );

  useEffect(() => {
    const cached = getCachedData();
    if (cached) {
      setServerData(cached);
    }

    fetch("/api/server-query")
      .then((res) => res.json())
      .then((data: ServerQueryResponse) => {
        setServerData(data);
        setCachedData(data);
      })
      .catch((e) => {
        console.error("Failed to fetch server status:", e);
      });
  }, []);

  return serverData;
}
