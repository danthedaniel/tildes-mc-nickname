import { useEffect } from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ServerProvider, useServerContext } from "@/components/ServerContext";
import { Layout } from "@/components/Layout";
import type { ServerQueryResponse } from "@/api-types";

const POLL_INTERVAL = 30000; // milliseconds

function ServerPoller() {
  const { setServerData } = useServerContext();

  useEffect(() => {
    const fetchServerStatus = () => {
      fetch("/api/server-query")
        .then((res) => res.json())
        .then((data: ServerQueryResponse) => {
          if (data.success) {
            setServerData(data.status);
          } else {
            console.error("Failed to fetch server status:", data.message);
          }
        })
        .catch((e) => {
          console.error("Failed to fetch server status:", e);
        });
    };

    fetchServerStatus();

    const interval = setInterval(fetchServerStatus, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [setServerData]);

  return null;
}

function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showBack = router.pathname !== "/";

  return (
    <>
      <ServerPoller />
      <Layout showBack={showBack}>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default function App(props: AppProps) {
  return (
    <ServerProvider>
      <AppContent {...props} />
    </ServerProvider>
  );
}
