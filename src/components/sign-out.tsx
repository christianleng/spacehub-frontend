"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function SignOut() {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Button type="submit" onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
