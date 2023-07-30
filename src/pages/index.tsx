import { useState } from "react";
import Head from "next/head";

export default function Index() {
  const [mcUsername, setMcUsername] = useState("");
  const [tildesUsername, setTildesUsername] = useState("");
  const [bio, setBio] = useState("");
  const [submittable, setSubmittable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function getHMAC() {
    if (!mcUsername) return;
    if (!tildesUsername) return;

    const response = await fetch("/api/hmac", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mcUsername,
        tildesUsername,
      })
    });

    if (response.status !== 200) {
      setStatus("Something went wrong, please try again later.");
      return;
    }

    const data = await response.json();
    if (!data.success) {
      setStatus(data.message);
      return;
    }

    setStatus("");
    setBio(`MCValidation:${data.hmac}`);
    setSubmittable(true);
  }

  async function doVerify() {
    if (!mcUsername) return;
    if (!tildesUsername) return;
    if (!bio) return;

    setIsLoading(true);

    const response = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mcUsername,
        tildesUsername,
        bio,
      }),
    });

    setIsLoading(false);

    if (response.status !== 200) {
      setStatus("Something went wrong, please try again later.");
      return;
    }

    const data = await response.json();
    if (!data.success) {
      setStatus(data.message);
      return;
    }

    setStatus(`Nickname set to ${tildesUsername}! You can remove the validation string from your bio now.`);
  }

  return (
    <>
      <Head>
        <title>Verify Your Tildes Account</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="mb-8 p-8 border-gray-300 bg-white rounded shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-2">Tildes SMP Username Verification</h2>
          <p className="text-sm text-gray-700">
            Get your Tildes account name as your Minecraft nickname!
          </p>
        </div>
        <div className="p-8 border border-gray-300 bg-white rounded shadow-lg max-w-md w-full">
          <p  className="block text-gray-700 text-sm font-bold mb-2">
            1. Log into the Minecraft server at tildes.nore.gg
          </p>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">2. Enter your Minecraft username</label>
            <input
              value={mcUsername}
              onInput={(e) => {
                setMcUsername(e.currentTarget.value.trim());
                setSubmittable(false);
              }}
              onBlur={(_e) => getHMAC()}
              onKeyDown={(e) => e.key === "Enter" && getHMAC()}
              autoComplete="off"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">3. Enter your Tildes username</label>
            <input
              value={tildesUsername}
              onInput={(e) => {
                setTildesUsername(e.currentTarget.value.trim());
                setSubmittable(false);
              }}
              onBlur={(_e) => getHMAC()}
              onKeyDown={(e) => e.key === "Enter" && getHMAC()}
              autoComplete="off"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              4. Copy this and paste it into your&nbsp;
              <a href="https://tildes.net/settings/bio" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Tildes account bio</a>
            </label>
            <input
              readOnly
              value={bio}
              onFocus={(e) => {
                e.currentTarget.select();
                document.execCommand("copy");
              }}
              autoComplete="off"
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-100 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
            />
          </div>
          <div className="mb-4">
          <button 
            disabled={!submittable} 
            className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline 
              ${!submittable || isLoading ? "bg-gray-300 text-gray-100 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700 text-white"}`}
            type="button"
            onClick={() => doVerify()}
          >
            {isLoading ? "Loading..." : "Verify my bio"}
          </button>
          </div>
          {status && <div className="mb-4"><p>{status}</p></div>}
        </div>
      </div>
    </>
  );
};