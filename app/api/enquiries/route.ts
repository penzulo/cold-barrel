import { getDb } from "../../../db";
import { enquiries } from "../../../db/schema";
import {
	earliestDelivery,
	flavours,
	MIN_LITRES,
	PRICE,
} from "../../../lib/cold-barrel";
import { supabase } from "../../../lib/supabase";

const allowed = new Set(flavours.map((item) => item.slug));
const invalid = (error: string) => Response.json({ error }, { status: 400 });
const trimmed = (value: unknown) =>
	typeof value === "string" ? value.trim() : "";

export async function POST(request: Request) {
	const site = request.headers.get("sec-fetch-site");
	if (site && site !== "same-origin" && site !== "none") {
		return Response.json(
			{ error: "Submit the enquiry from the Cold Barrel website." },
			{ status: 403 },
		);
	}

	let body: Record<string, unknown>;
	try {
		const raw = await request.text();
		if (raw.length > 8192) return invalid("The enquiry is too long.");
		body = JSON.parse(raw);
		if (!body || typeof body !== "object")
			return invalid("Enter your enquiry details.");
	} catch {
		return invalid("Enter your enquiry details.");
	}
	const id = trimmed(body.id);
	const name = trimmed(body.name);
	const phone = trimmed(body.phone).replace(/[\s()-]/g, "");
	const location = trimmed(body.location);
	const pin = trimmed(body.pin);
	const deliveryDate = trimmed(body.deliveryDate);
	const litres = body.litres;
	const selected = body.flavours;
	if (!/^[a-f0-9-]{36}$/i.test(id))
		return invalid("Refresh the page before submitting again.");
	if (!name || name.length > 100) return invalid("Enter your full name.");
	if (!/^(?:\+91|91|0)?[6-9][0-9]{9}$/.test(phone))
		return invalid("Enter a valid Indian mobile number.");
	if (!location || location.length > 240 || !/^[1-9][0-9]{5}$/.test(pin))
		return invalid("Enter a delivery location and a six-digit PIN code.");
	const parsedDate = new Date(deliveryDate + "T00:00:00Z");
	if (
		!/^\d{4}-\d{2}-\d{2}$/.test(deliveryDate) ||
		!Number.isFinite(parsedDate.valueOf()) ||
		parsedDate.toISOString().slice(0, 10) !== deliveryDate ||
		deliveryDate < earliestDelivery()
	) {
		return invalid("Choose a delivery date at least 2 days ahead in Pune.");
	}
	if (
		typeof litres !== "number" ||
		!Number.isFinite(litres * PRICE) ||
		litres < MIN_LITRES
	)
		return invalid("Enter at least 5 litres.");
	if (
		!Array.isArray(selected) ||
		!selected.length ||
		selected.length > allowed.size ||
		!selected.every((item) => allowed.has(item))
	) {
		return invalid("Choose at least one flavour from the menu.");
	}

	try {
		if (supabase) {
			const { error } = await supabase.from("enquiries").insert({
				id,
				name,
				phone: "+91" + phone.slice(-10),
				location,
				pin,
				delivery_date: deliveryDate,
				litres,
				flavours: [...new Set<string>(selected)],
				created_at: new Date().toISOString(),
			});
			if (!error) {
				return Response.json({ saved: true }, { status: 201 });
			}
			console.error("Supabase insert error, falling back to local db:", error);
		}

		await getDb()
			.insert(enquiries)
			.values({
				id,
				name,
				phone: "+91" + phone.slice(-10),
				location,
				pin,
				deliveryDate,
				litres,
				flavours: [...new Set<string>(selected)],
				createdAt: new Date(),
			})
			.onConflictDoNothing();
		return Response.json({ saved: true }, { status: 201 });
	} catch {
		return Response.json(
			{ error: "Your enquiry could not be saved. Please try again." },
			{ status: 503 },
		);
	}
}
