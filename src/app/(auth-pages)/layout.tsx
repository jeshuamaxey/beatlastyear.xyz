import SiteNav from "@/components/site-nav";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-12">
      <SiteNav />
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-12 items-start">{children}</div>
    </div>
  );
}
