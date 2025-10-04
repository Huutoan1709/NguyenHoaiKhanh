import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlobalBackground from "@/components/common/GlobalBackground";
import { LayoutProvider } from "@/providers/LayoutProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nguyễn Hoài Khánh",
  description: "Trang thông tin cá nhân",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen relative`}>
        {/* Global Background */}
        <GlobalBackground />
        
        <LayoutProvider>
          <div className="relative z-10">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </LayoutProvider>
      </body>
    </html>
  );
}
