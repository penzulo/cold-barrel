import { OrderFacts } from '../../components/cold-barrel';
import { INSTAGRAM, PHONE, PHONE_LINK } from '../../lib/cold-barrel';

export const metadata = { title: 'Delivery & Contact' };

export default function Contact() {
  return <section className="wide section page-top"><p className="eyebrow">Delivery &amp; contact</p><h1>Delivered across Pune.</h1>
    <p className="intro">Tell us where and when you need your shakes. We’ll call you to confirm availability and the delivery charge.</p><OrderFacts/>
    <div className="contact-columns"><div><h2>How to order</h2><ol className="steps"><li>Choose your preferred flavours.</li><li>Send us your date, Pune delivery location and total litres.</li><li>We’ll call to confirm your order and delivery charge.</li></ol><a className="button" href="/enquiry">Send an enquiry</a></div>
    <aside className="contact-box"><h2>Get in touch</h2><p><a className="text-link" href={PHONE_LINK}>{PHONE}</a></p><p><a className="text-link" href={INSTAGRAM}>@coldbarrelbeverages</a></p></aside></div>
  </section>;
}
