import { Button } from "@/components/ui/button";
import { Github } from "@/components/ui/github";
import { signIn } from "@/features/auth/server/auth";

const GithubSignIn = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      <Button className="w-full" variant="outline">
        <Github className="mr-2 h-4 w-4" />
        Continue with GitHub
      </Button>
    </form>
  );
};

export { GithubSignIn };
