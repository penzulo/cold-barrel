import { PRESERVATIVE_NOTE } from "../../lib/cold-barrel";

export const metadata = { title: "FSSAI Registration & Ingredients" };

export default function FoodRegistration() {
	return (
		<section className="wide section page-top">
			<p className="eyebrow">Cold Barrel</p>
			<h1>Food business registration.</h1>
			<p className="intro">
				Cold Barrel’s registration certificate was issued under the Food Safety
				and Standards Act, 2006.
			</p>
			<div className="contact-columns">
				<div className="form-card">
					<h2>FSSAI registration certificate</h2>
					<dl className="registration-details">
						<dt>Registration number</dt>
						<dd>21526036003613</dd>
						<dt>Issued on</dt>
						<dd>22 August 2026</dd>
						<dt>Issuing authority</dt>
						<dd>Pune Municipal Corporation</dd>
					</dl>
					<div className="actions">
						<a
							className="button secondary"
							href="https://foscos.fssai.gov.in/"
							target="_blank"
							rel="noopener noreferrer"
						>
							FSSAI FoSCoS portal
						</a>
					</div>
				</div>
				<aside className="contact-box">
					<h2>Preservatives</h2>
					<p>{PRESERVATIVE_NOTE}</p>
				</aside>
			</div>
		</section>
	);
}
