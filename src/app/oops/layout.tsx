import SiteNav from "@/components/site-nav";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-12">
      <SiteNav />
      <div className="max-w-5xl flex flex-col gap-12 items-start">{children}</div>
    </div>
  );
}
