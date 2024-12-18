import { ThemeProvider } from "next-themes";
import "./globals.css";
import TanstackQuery from "@/providers/tanstack-query";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { CSPostHogProvider } from "@/providers/cs-posthog-provider";
import { Host_Grotesk, Rubik_Mono_One } from 'next/font/google'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Beat Last Year",
  description: "Show yourself and the world you're getting better every year",
};

const hostGrotesk = Host_Grotesk({
  subsets: ['latin'],
  variable: '--font-host-grotesk',
})

const rubikMonoOne = Rubik_Mono_One({
  subsets: ['latin'],
  variable: '--font-rubic-mono-one',
  weight: '400'
})

console.log({
  hostGrotesk,
  rubikMonoOne
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className={`${hostGrotesk.variable} ${rubikMonoOne.variable} font-sans`} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <CSPostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TanstackQuery>
              <main className="min-h-screen">
                {children}
              </main>
              <SpeedInsights />
              <Toaster />
            </TanstackQuery>
          </ThemeProvider>
        </CSPostHogProvider>
      </body>
    </html>
  );
}
