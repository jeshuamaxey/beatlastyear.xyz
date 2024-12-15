import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";

import { helloWorld } from "../../../inngest/functions/hello-world";
import { syncStravaData } from "@/inngest/functions/sync-strava-data";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    syncStravaData
  ],
});
