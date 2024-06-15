import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import ReactQueryProvider from "@/Provider"

const monserrat = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Code Type Prcatice",
  description: "practice coding with typing speed",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={monserrat.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  )
}
