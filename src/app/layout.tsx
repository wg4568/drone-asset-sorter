import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Drone Asset Sorter",
    description: "Sort your drone assets based on capture time and GPS data",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
