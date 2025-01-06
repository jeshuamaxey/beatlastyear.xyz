import PersonalBestChartGrid from "@/components/personal-best-chart-grid";
import ProfileHeader from "@/components/profile-header";
import Share from "@/components/share";

console.warn("Add pre-fetching of profile data here")

export default async function ProtectedPage({params}: {params: Promise<{slug: string}>}) {
  const { slug } = await params

  return (
    <div className="flex flex-col gap-4">
      <ProfileHeader slug={slug}/>
      <PersonalBestChartGrid slug={slug} />
      <div className="flex flex-col gap-2 px-4">
        <Share slug={slug} />
      </div>
    </div>
  );
}
