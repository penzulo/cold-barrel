import type { CSSProperties } from "react";
import { flavours, INSTAGRAM, PHONE, PHONE_LINK } from "../lib/cold-barrel";

export function Brand() {
	return (
		<a className="brand" href="/" aria-label="Cold Barrel home">
			<img src="/photos/barrel.png" alt="" width="32" height="36" />
			<span>
				COLD<span>BARREL</span>
			</span>
		</a>
	);
}

export function Header() {
	return (
		<header className="site-header">
			<div className="wide header-inner">
				<Brand />
				<nav aria-label="Main navigation">
					<a href="/">Home</a>
					<a href="/flavours">Flavours</a>
					<a href="/contact">Delivery &amp; Contact</a>
				</nav>
				<a className="button header-button" href="/enquiry">
					Send an enquiry
				</a>
			</div>
		</header>
	);
}

export function Footer() {
	return (
		<footer className="site-footer">
			<div className="wide footer-inner">
				<div>
					<Brand />
					<p>Thick. Creamy. Unforgettable.</p>
				</div>
				<div className="footer-links">
					<a href={PHONE_LINK}>{PHONE}</a>
					<a href={INSTAGRAM}>Instagram</a>
					<a href="/food-registration">FSSAI registration</a>
					<a href="/team/inbox">Team inbox</a>
				</div>
			</div>
		</footer>
	);
}

export function OrderFacts() {
	return (
		<dl className="order-facts">
			<div>
				<dt>₹300</dt>
				<dd>Per litre</dd>
			</div>
			<div>
				<dt>5 litres</dt>
				<dd>Minimum order · from ₹1,500</dd>
			</div>
			<div>
				<dt>2 days</dt>
				<dd>Advance notice</dd>
			</div>
			<div>
				<dt>All Pune</dt>
				<dd>Delivery charged separately</dd>
			</div>
		</dl>
	);
}

export function FlavourGrid() {
	return (
		<ul className="flavour-grid">
			{flavours.map((flavour) => (
				<li
					key={flavour.slug}
					className="flavour-card"
					style={{ "--accent": flavour.colour } as CSSProperties}
				>
					<a href={"/flavours/" + flavour.slug}>
						<div className="card-image">
							<img
								src={"/photos/" + flavour.slug + ".webp"}
								alt=""
								loading="lazy"
							/>
						</div>
						<div className="card-content">
							<h3>{flavour.name}</h3>
							<p>{flavour.description}</p>
							<span>₹300 per litre</span>
						</div>
					</a>
				</li>
			))}
		</ul>
	);
}
