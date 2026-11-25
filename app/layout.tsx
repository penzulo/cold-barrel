import type { Metadata, Viewport } from "next";
import { Footer, Header } from "../components/cold-barrel";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://coldbarrel.shop";

export const viewport: Viewport = {
	themeColor: "#FFFBF2",
	colorScheme: "light",
	width: "device-width",
	initialScale: 1,
};

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "Cold Barrel | Thick Milkshakes in Pune",
		template: "%s | Cold Barrel",
	},
	description:
		"Thick milkshakes and cold coffee for parties, conferences and events across Pune. Order from five flavours at ₹300 per litre.",
	applicationName: "Cold Barrel",
	authors: [{ name: "Cold Barrel Beverages", url: siteUrl }],
	creator: "Cold Barrel Beverages",
	publisher: "Cold Barrel Beverages",
	keywords: [
		"cold barrel",
		"milkshakes pune",
		"cold coffee pune",
		"bulk milkshake delivery",
		"event catering pune",
		"thick milkshakes",
		"party beverages pune",
	],
	alternates: {
		canonical: "/",
	},
	icons: {
		icon: [
			{ url: "/favicon.svg", type: "image/svg+xml" },
			{ url: "/photos/barrel.png", type: "image/png" },
		],
		apple: [{ url: "/photos/barrel.png", sizes: "180x180", type: "image/png" }],
		shortcut: ["/photos/barrel.png"],
	},
	openGraph: {
		type: "website",
		locale: "en_IN",
		url: siteUrl,
		siteName: "Cold Barrel",
		title: "Cold Barrel | Thick Milkshakes in Pune",
		description:
			"Thick milkshakes and cold coffee for parties, conferences and events across Pune. Order from five flavours at ₹300 per litre.",
		images: [
			{
				url: "/photos/hero.webp",
				width: 864,
				height: 682,
				alt: "Cold Barrel thick milkshakes and cold coffee varieties",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Cold Barrel | Thick Milkshakes in Pune",
		description:
			"Thick milkshakes and cold coffee for parties, conferences and events across Pune. Order from five flavours at ₹300 per litre.",
		images: ["/photos/hero.webp"],
	},
	appleWebApp: {
		capable: true,
		title: "Cold Barrel",
		statusBarStyle: "default",
	},
	formatDetection: {
		telephone: true,
		date: false,
		address: true,
		email: false,
	},
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
