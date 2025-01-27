import { Database } from '@/utils/supabase/database.types'
import { createClient } from '@supabase/supabase-js'

export const createAdminClient = async () => {
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