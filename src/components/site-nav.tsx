import Link from "next/link"
import HeaderAuth from "./header-auth"

const SiteNav = () => {
  return <nav className="w-full bg-background flex justify-center border-b border-b-foreground/10 h-16">
    <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
      <div className="flex gap-5 items-center font-display tracking-tighter leading-none">
        <Link href={"/"}>Beat<br/>last<br/>year</Link>
      </div>
      <HeaderAuth />
    </div>
  </nav>
}

export default SiteNav
