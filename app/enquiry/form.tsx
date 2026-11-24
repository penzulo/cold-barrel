"use client";

import { type FormEvent, useState } from "react";
import {
	earliestDelivery,
	flavours,
	MIN_LITRES,
	PHONE,
	PHONE_LINK,
	PRICE,
	rupees,
	WHATSAPP,
} from "../../lib/cold-barrel";

export default function EnquiryForm({
	selected,
	minDate,
}: {
	selected?: string;
	minDate: string;
}) {
	const [litres, setLitres] = useState(String(MIN_LITRES));
	const [error, setError] = useState("");
	const [chatLink, setChatLink] = useState("");
	const amount = Number(litres);

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		setChatLink("");
		const form = event.currentTarget;
		const data = new FormData(form);
		const selectedFlavours = data.getAll("flavours");
		const names = flavours
			.filter((item) => selectedFlavours.includes(item.slug))
			.map((item) => item.name);
		const name = String(data.get("name") ?? "").trim();
		const phone = String(data.get("phone") ?? "").replace(/[\s()-]/g, "");
		const location = String(data.get("location") ?? "").trim();
		const pin = String(data.get("pin") ?? "").trim();
		const deliveryDate = String(data.get("deliveryDate") ?? "");

		if (!name || !location) {
			setError("Enter your full name and delivery location.");
			return;
		}
		if (!/^(?:\+91|91|0)?[6-9][0-9]{9}$/.test(phone)) {
			setError("Enter a valid Indian mobile number.");
			form.querySelector<HTMLInputElement>('input[name="phone"]')?.focus();
			return;
		}
		if (deliveryDate < earliestDelivery()) {
			setError("Choose a delivery date at least 2 days ahead in Pune.");
			return;
		}
		if (amount < MIN_LITRES || !Number.isFinite(amount * PRICE)) {
			setError("Enter at least 5 litres.");
			return;
		}
		if (!names.length) {
			setError("Choose at least one preferred flavour.");
			form.querySelector<HTMLInputElement>('input[name="flavours"]')?.focus();
			return;
		}

		// Also record enquiry in Supabase database in background
		fetch("/api/enquiries", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: crypto.randomUUID(),
				name,
				phone,
				location,
				pin,
				deliveryDate,
				litres: amount,
				flavours: selectedFlavours,
			}),
		}).catch((err) => {
			console.error("Failed to log enquiry to database:", err);
		});

		const message = [
			"Hi Cold Barrel! I’d like to enquire about a bulk order.",
			"",
			`Name: ${name}`,
			`Callback number: +91 ${phone.slice(-10)}`,
			`Delivery location: ${location}, Pune ${pin}`,
			`Preferred delivery date: ${deliveryDate}`,
			`Quantity: ${amount} litres`,
			`Preferred flavours: ${names.join(", ")}`,
			`Estimated beverage subtotal: ${rupees(amount * PRICE)} (delivery charged separately)`,
		].join("\n");

		const url = `${WHATSAPP}?text=${encodeURIComponent(message)}`;
		setChatLink(url);
		window.open(url, "_blank", "noopener,noreferrer");
	}

	return (
		<div className="enquiry-grid">
			<div className="form-card">
				<form onSubmit={submit}>
					<fieldset className="form-fields">
						<legend>Tell us about your order</legend>
						<div className="input-grid">
							<label>
								Full name
								<input
									required
									name="name"
									autoComplete="name"
									maxLength={100}
								/>
							</label>
							<label>
								Phone number
								<input
									required
									name="phone"
									type="tel"
									autoComplete="tel"
									maxLength={25}
									placeholder="+91"
								/>
							</label>
							<label>
								Pune delivery location
								<input
									required
									name="location"
									autoComplete="street-address"
									maxLength={240}
									placeholder="Address or locality"
								/>
							</label>
							<label>
								PIN code
								<input
									required
									name="pin"
									inputMode="numeric"
									autoComplete="postal-code"
									pattern="[1-9][0-9]{5}"
									maxLength={6}
								/>
							</label>
							<label>
								Preferred delivery date
								<input
									required
									name="deliveryDate"
									type="date"
									min={minDate}
									aria-describedby="date-note"
								/>
								<small id="date-note">At least 2 days ahead.</small>
							</label>
							<label>
								Total litres required
								<input
									required
									name="litres"
									type="number"
									min={MIN_LITRES}
									step="any"
									value={litres}
									onChange={(event) => setLitres(event.target.value)}
								/>
								<small>Minimum 5 litres.</small>
							</label>
						</div>
						<fieldset className="flavour-picker">
							<legend>Preferred flavours</legend>
							<p>Choose one or more. We’ll confirm your selection when we call.</p>
							<div className="choices">
								{flavours.map(({ slug, short }) => (
									<label key={slug}>
										<input
											type="checkbox"
											name="flavours"
											value={slug}
											defaultChecked={slug === selected}
										/>
										{short}
									</label>
								))}
							</div>
						</fieldset>
						{error && (
							<p className="error" role="alert">
								{error}
							</p>
						)}
						<button type="submit" className="button">
							Enquire on WhatsApp
						</button>
						<p className="whatsapp-note">
							WhatsApp opens with your details filled in. Tap Send there to submit your enquiry.
						</p>
						{chatLink && (
							<p className="whatsapp-note" role="status">
								If the chat didn’t open,{" "}
								<a
									className="text-link"
									href={chatLink}
									target="_blank"
									rel="noopener noreferrer"
								>
									open WhatsApp here
								</a>.
							</p>
						)}
					</fieldset>
				</form>
			</div>
			<aside className="estimate">
				<h2>Your estimate</h2>
				<dl>
					<div>
						<dt>Price per litre</dt>
						<dd>{rupees(PRICE)}</dd>
					</div>
					<div>
						<dt>Quantity</dt>
						<dd>{amount > 0 ? `${amount} L` : "—"}</dd>
					</div>
				</dl>
				<div className="estimate-total">
					<span>Beverage subtotal</span>
					<output aria-live="polite">
						{amount > 0 && Number.isFinite(amount * PRICE)
							? rupees(amount * PRICE)
							: "—"}
					</output>
				</div>
				<p>Delivery charged separately.</p>
				<hr />
				<p>
					Questions? <a href={PHONE_LINK}>{PHONE}</a>
				</p>
			</aside>
		</div>
	);
}
