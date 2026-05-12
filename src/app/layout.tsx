import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Spend Audit | Stop Overpaying for Dev Tools",
  description: "Instantly evaluate your startup's AI tool spend and find hundreds of dollars in monthly savings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        {children}
        <ToastContainer theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
