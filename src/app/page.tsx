import React from "react";
import { redirect } from "next/navigation";
import SignOut from "@/components/sign-out";
import { auth } from "@/features/auth/server/auth";

const Home = async () => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Coworking — Skeleton</h1>
      <p>User email : {session.user?.email}</p>

      <SignOut />
    </main>
  );
};

export default Home;
