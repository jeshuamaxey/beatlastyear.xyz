import IdentifyUserToPosthog from "@/components/id-user-to-posthog"
import { Suspense } from "react"

const PostSignInPage = () => {
  return <Suspense fallback={
    <div className="w-full h-full flex flex-col justify-around items-center">
      <p>Logging you in...</p>
    </div>
    }>
    <IdentifyUserToPosthog redirectTo="/p/me"/>
  </Suspense>
}

export default PostSignInPage
