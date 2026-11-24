import { earliestDelivery, flavours } from "../../lib/cold-barrel";
import EnquiryForm from "./form";

export const metadata = { title: "Send an Enquiry" };
export const dynamic = "force-dynamic";

export default async function Enquiry({
	searchParams,
}: {
	searchParams: Promise<{ flavour?: string }>;
}) {
	const { flavour } = await searchParams;
	return (
		<section className="wide section page-top enquiry-page">
			<p className="eyebrow">Bulk orders across Pune</p>
			<h1>Send an enquiry.</h1>
			<p className="intro">
				Tell us about your event and send your details to Cold Barrel on WhatsApp. We’ll confirm availability and the delivery charge.
			</p>
			<EnquiryForm
				selected={
					flavours.some((item) => item.slug === flavour) ? flavour : undefined
				}
				minDate={earliestDelivery()}
			/>
		</section>
	);
}
