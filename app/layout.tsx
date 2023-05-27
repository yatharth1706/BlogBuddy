import NavigationBar from "@/components/NavigationBar";
import "./globals.css";
import { Inter } from "next/font/google";
import { RecoilRoot } from "recoil";
import RecoilProvider from "@/providers/RecoilProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blogging App",
  description: "Blogging website for professionals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " text-sm"}>
        <RecoilProvider>
          <NavigationBar />
          {children}
        </RecoilProvider>
      </body>
    </html>
  );
}
