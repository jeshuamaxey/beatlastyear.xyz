import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <form className="flex flex-col w-full px-4 md:min-w-96 md:max-w-96 mx-auto">
      <h1 className="text-2xl font-medium">Sign up</h1>
      <p className="text-sm text text-foreground">
        Already have an account?{" "}
        <Link className="text-primary font-medium underline" href="/sign-in">
          Sign in
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          minLength={6}
          required
        />
        <Label htmlFor="slug">Username</Label>
        <Input
          type="string"
          name="slug"
          placeholder="creaky-turtle"
          minLength={3}
          required
        />

        <SubmitButton formAction={signUpAction} pendingText="Signing up...">
          Sign up
        </SubmitButton>

        <p className="my-4 text-sm">
          By signing up you agree to our <Link className="underline underline-offset-0 hover:underline-offset-2" href="/legal/tos">terms of service</Link>. You can view our <Link className="underline underline-offset-0 hover:underline-offset-2" href="/legal/privacy">privacy policy here</Link>
        </p>

        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
