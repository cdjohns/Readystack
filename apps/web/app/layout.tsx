import type { ReactNode } from "react";

export const metadata = {
  title: "ReadyStack",
  description: "ReadyStack baseline application",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
