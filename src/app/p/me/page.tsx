import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

const MyPage = () => {
  const supabase = createClient()

  return supabase.then(client => {
    return client.auth.getUser().then(({data, error}) => {
      const slug = data.user?.user_metadata.slug

      return redirect(`/p/${slug}`)
    })
  })
}

export default MyPage
