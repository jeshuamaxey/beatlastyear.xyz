import { Button } from "@/components/ui/button";
import Link from "next/link";

const OopsPage = () => {
  return <div className="text-center space-y-4">
    <h3 className="text-3xl">Something went wrong</h3>
    <p className="">Oops! Sorry about that. Let&apos; get you back on track.</p>
    <Button asChild>
      <Link href="/">Go home</Link>
    </Button>
  </div>
}

export default OopsPage;
