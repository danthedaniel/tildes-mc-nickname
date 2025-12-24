import Head from "next/head";
import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { NotifyButton } from "@/components/NotifyButton";
import { ServerStatusCard } from "@/components/ServerStatusCard";

export default function Index() {
  return (
    <>
      <Head>
        <title>Tildes Minecraft</title>
      </Head>

      <ServerStatusCard />

      <Countdown />

      <NotifyButton />

      <Link
        href="/verify"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-hidden focus:shadow-outline max-w-md w-full text-center"
      >
        Get Build Access
      </Link>
    </>
  );
}
