import PersonalBestChartGrid from "@/components/personal-best-chart-grid";
import ProfileHeader from "@/components/profile-header";

console.warn("Add pre-fetching of profile data here")

export default async function ProtectedPage({params}: {params: Promise<{slug: string}>}) {
  const { slug } = await params
  return (
    <>
      <ProfileHeader slug={slug}/>
      <PersonalBestChartGrid slug={slug} />
    </>
  );
}
