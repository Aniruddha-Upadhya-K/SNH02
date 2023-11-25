import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { Button } from "@/components/ui/button" 
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>PulseSync</title>
        <meta name="description" content="PulseSync" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
       <Button className="bg-white">Register</Button>
      </main>
    </>
  );
}
