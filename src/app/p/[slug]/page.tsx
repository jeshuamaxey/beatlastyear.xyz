import PersonalBestChartGrid from "@/components/personal-best-chart-grid";
import ProfileHeader from "@/components/profile-header";
import ShareButton from "@/components/share-button";

console.warn("Add pre-fetching of profile data here")

export default async function ProtectedPage({params}: {params: Promise<{slug: string}>}) {
  const { slug } = await params
  return (
    <div className="flex flex-col gap-4">
      <ProfileHeader slug={slug}/>
      <PersonalBestChartGrid slug={slug} />
      <ShareButton slug={slug} url={"/ig-story.png"} text="Share png" />
      <ShareButton slug={slug} url={"/ig-story.svg"} text="Share svg" />
    </div>
  );
}
