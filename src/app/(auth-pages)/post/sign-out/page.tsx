import ResetPosthog from "@/components/reset-posthog"
import { Suspense } from "react"

const PostSignOutPage = () => {
  return <Suspense fallback={
    <div className="w-full h-full flex flex-col justify-around items-center">
      <p>Logging you out...</p>
    </div>
    }>
    <ResetPosthog redirectTo="/sign-in"/>
  </Suspense>
}

export default PostSignOutPage
