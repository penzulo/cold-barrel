import type { Metadata } from "next";
import { Footer, Header } from "../components/cold-barrel";
import "./globals.css";

export const metadata: Metadata = {
	title: {
		default: "Cold Barrel | Thick Milkshakes in Pune",
		template: "%s | Cold Barrel",
	},
	description:
		"Thick milkshakes and cold coffee for parties, conferences and events across Pune. Order from five flavours at ₹300 per litre.",
	icons: { icon: "/photos/barrel.png" },
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en-IN">
			<body>
				<a className="skip" href="#main">
					Skip to content
				</a>
				<Header />
				<main id="main">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
