import { Database } from '@/utils/supabase/autogen.types'
import { createClient } from '@supabase/supabase-js'

export const createAdminClient = async (
  // NEXT_PUBLIC_SUPABASE_URL: string,
  // SUPABASE_SERVICE_KEY: string
) => {
  const supabase = await createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  return supabase
}