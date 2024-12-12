"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ReactNode } from "react"

const TanstackQuery = ({ children }: { children: ReactNode}) => {
  const queryClient = new QueryClient()

  return <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools />
  </QueryClientProvider>
}

export default TanstackQuery
