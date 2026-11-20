import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { enquiries } from "../../../db/schema";
import { flavours, PRICE, rupees } from "../../../lib/cold-barrel";
import { supabase } from "../../../lib/supabase";
import { chatGPTSignInPath, getChatGPTUser } from "../../chatgpt-auth";

export const metadata = {
	title: "Team Inbox",
	robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
const pageSize = 30;
const dateLabel = new Intl.DateTimeFormat("en-IN", {
	dateStyle: "medium",
	timeZone: "Asia/Kolkata",
});

type EnquiryItem = {
	id: string;
	name: string;
	phone: string;
	deliveryDate: string;
	location: string;
	pin: string;
	litres: number;
	flavours: string[];
	createdAt: Date;
};

export default async function Inbox({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; secret?: string }>;
}) {
	const params = await searchParams;
	const user = await getChatGPTUser();
	const ownerEmail = process.env.INBOX_OWNER_EMAIL;
	const inboxSecret = process.env.INBOX_SECRET;

	// Access control:
	// 1. If INBOX_SECRET is configured, require ?secret=<INBOX_SECRET>
	// 2. Or if INBOX_OWNER_EMAIL + ChatGPT SSO is configured, check user.email
	// 3. Otherwise (dev / initial Netlify setup without secret), permit viewing
	const isAuthorized =
		(inboxSecret && params.secret === inboxSecret) ||
		(ownerEmail && user && user.email.toLowerCase() === ownerEmail.toLowerCase()) ||
		(!inboxSecret && !ownerEmail);

	if (!isAuthorized) {
		return (
			<section className="wide section page-top">
				<h1>Team inbox</h1>
				<p>
					{inboxSecret
						? "Access restricted. Provide the ?secret= passcode in the URL to view enquiries."
						: "Sign in with your Cold Barrel team account or set INBOX_SECRET in your environment variables."}
				</p>
				{user ? null : (
					<a
						className="button"
						href={chatGPTSignInPath("/team/inbox")}
						target="_top"
					>
						Sign in
					</a>
				)}
			</section>
		);
	}

	const requestedPage = Number(params.page);
	const page =
		Number.isSafeInteger(requestedPage) &&
		requestedPage > 0 &&
		requestedPage < 1000000
			? requestedPage
			: 1;

	let rows: EnquiryItem[] = [];

	if (supabase) {
		const { data, error } = await supabase
			.from("enquiries")
			.select("*")
			.order("created_at", { ascending: false })
			.range((page - 1) * pageSize, page * pageSize);

		if (!error && data) {
			rows = data.map((item) => ({
				id: String(item.id),
				name: String(item.name),
				phone: String(item.phone),
				deliveryDate: String(item.delivery_date),
				location: String(item.location),
				pin: String(item.pin),
				litres: Number(item.litres),
				flavours: Array.isArray(item.flavours) ? item.flavours : [],
				createdAt: new Date(item.created_at),
			}));
		} else if (error) {
			console.error("Supabase query error:", error);
		}
	}

	// Fallback to local SQLite if Supabase returned no rows or had an error
	if (rows.length === 0) {
		try {
			const localRows = await getDb()
				.select()
				.from(enquiries)
				.orderBy(desc(enquiries.createdAt), desc(enquiries.id))
				.limit(pageSize + 1)
				.offset((page - 1) * pageSize);

			rows = localRows.map((item) => ({
				id: item.id,
				name: item.name,
				phone: item.phone,
				deliveryDate: item.deliveryDate,
				location: item.location,
				pin: item.pin,
				litres: item.litres,
				flavours: item.flavours,
				createdAt: item.createdAt,
			}));
		} catch (e) {
			console.error("Local db query error:", e);
		}
	}

	const secretQuery = params.secret
		? `&secret=${encodeURIComponent(params.secret)}`
		: "";

	return (
		<section className="wide section page-top">
			<h1>Team inbox</h1>
			<p className="intro">
				Call customers to confirm availability, order details and delivery
				charges.
			</p>
			{rows.length === 0 && <p>No enquiries on this page.</p>}
			<ul className="inbox-grid">
				{rows.slice(0, pageSize).map((item) => (
					<li className="form-card" key={item.id}>
						<p className="eyebrow">
							Received {dateLabel.format(item.createdAt)}
						</p>
						<h2>{item.name}</h2>
						<a className="text-link" href={"tel:" + item.phone}>
							{item.phone}
						</a>
						<dl className="inbox-details">
							<dt>Delivery</dt>
							<dd>
								{dateLabel.format(new Date(item.deliveryDate + "T00:00:00Z"))}
								<br />
								{item.location} · {item.pin}
							</dd>
							<dt>Order</dt>
							<dd>
								{item.litres} L · {rupees(item.litres * PRICE)}
								<br />
								{item.flavours
									.map(
										(slug) =>
											flavours.find((flavour) => flavour.slug === slug)
												?.short ?? slug,
									)
									.join(", ")}
							</dd>
						</dl>
					</li>
				))}
			</ul>
			<nav className="actions" aria-label="Inbox pages">
				{page > 1 && (
					<a
						className="button secondary"
						href={`?page=${page - 1}${secretQuery}`}
					>
						Previous page
					</a>
				)}
				{rows.length > pageSize && (
					<a className="button" href={`?page=${page + 1}${secretQuery}`}>
						Next page
					</a>
				)}
			</nav>
		</section>
	);
}
