import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Activity Booking",
    description: "Book your favorite activities",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col">
                        <Navbar />
                        <main className="container mx-auto px-4 py-8 flex-grow">
                            {children}
                        </main>
                        <footer className="border-t-2 border-black bg-white p-6 text-center mt-auto">
                            <p className="text-black font-bold uppercase tracking-widest text-sm">
                                Made with 🖤 by Shashi
                            </p>
                        </footer>
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}
