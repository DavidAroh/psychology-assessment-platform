import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthWrapper } from "@/components/auth-wrapper"
import "./globals.css"

export const metadata: Metadata = {
  title: "Psychology Assessment Platform",
  description: "Professional psychology assessment and reporting platform for clinicians",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AuthWrapper>
          <Suspense fallback={null}>{children}</Suspense>
        </AuthWrapper>
        <Analytics />
      </body>
    </html>
  )
}
