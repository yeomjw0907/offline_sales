import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ReadyTalk 파트너",
  description: "ReadyTalk 영업 파트너 모집 및 운영 시스템",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
