export const PRICE = 300;
export const MIN_LITRES = 5;
export const PHONE = "+91 95038 77125";
export const PHONE_LINK = "tel:+919503877125";
export const WHATSAPP = "https://wa.me/919503877125";
export const PRESERVATIVE_NOTE =
	"We don’t add any preservatives when preparing our milkshakes. The syrups we use already contain preservatives.";
export const INSTAGRAM = "https://www.instagram.com/coldbarrelbeverages/";

export const flavours = [
	{
		slug: "strawberry",
		name: "Strawberry Milkshake",
		short: "Strawberry",
		colour: "#f3c5ca",
		description:
			"Sweet strawberry flavour blended with creamy milk for a thick, fruity shake.",
	},
	{
		slug: "blueberry",
		name: "Blueberry Milkshake",
		short: "Blueberry",
		colour: "#ded0ed",
		description:
			"The rich taste of blueberries combined with creamy milk for a smooth, thick shake.",
	},
	{
		slug: "oreo",
		name: "Oreo Milkshake",
		short: "Oreo",
		colour: "#e7d9cb",
		description:
			"Chocolate cookie flavour blended with creamy milk for a thick cookies-and-cream shake.",
	},
	{
		slug: "chocolate",
		name: "Chocolate Milkshake",
		short: "Chocolate",
		colour: "#dfb9a8",
		description:
			"Deep chocolate flavour blended with creamy milk for a rich, velvety shake.",
	},
	{
		slug: "cold-coffee",
		name: "Thick Cold Coffee",
		short: "Cold Coffee",
		colour: "#ebceb0",
		description:
			"Bold coffee flavour blended with creamy milk for a thick, chilled finish.",
	},
];

export function earliestDelivery(now = new Date()) {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Asia/Kolkata",
		year: "numeric",
		month: "numeric",
		day: "numeric",
	}).formatToParts(now);
	const value = (type: string) =>
		Number(parts.find((part) => part.type === type)?.value);
	return new Date(Date.UTC(value("year"), value("month") - 1, value("day") + 2))
		.toISOString()
		.slice(0, 10);
}

export function rupees(amount: number) {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 2,
		minimumFractionDigits: 0,
	}).format(amount);
}
