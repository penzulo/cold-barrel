import { env } from 'cloudflare:workers';
import { desc } from 'drizzle-orm';
import { getDb } from '../../../db';
import { enquiries } from '../../../db/schema';
import { flavours, PRICE, rupees } from '../../../lib/cold-barrel';
import { chatGPTSignInPath, getChatGPTUser } from '../../chatgpt-auth';

export const metadata = { title: 'Team Inbox', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';
const pageSize = 30;
const dateLabel = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' });

export default async function Inbox({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const user = await getChatGPTUser();
  if (!user) return <section className="wide section page-top"><h1>Team inbox</h1><p>Sign in with your Cold Barrel team account.</p><a className="button" href={chatGPTSignInPath('/team/inbox')} target="_top">Sign in</a></section>;
  if (!env.INBOX_OWNER_EMAIL || user.email.toLowerCase() !== env.INBOX_OWNER_EMAIL.toLowerCase()) {
    return <section className="wide section page-top"><h1>Team inbox</h1><p>This inbox is available to the Cold Barrel owner account.</p></section>;
  }
  const requestedPage = Number((await searchParams).page);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 && requestedPage < 1000000 ? requestedPage : 1;
  const rows = await getDb().select().from(enquiries).orderBy(desc(enquiries.createdAt), desc(enquiries.id)).limit(pageSize + 1).offset((page - 1) * pageSize);
  return <section className="wide section page-top">
    <h1>Team inbox</h1>
    <p className="intro">Call customers to confirm availability, order details and delivery charges.</p>
    {rows.length === 0 && <p>No enquiries on this page.</p>}
    <ul className="inbox-grid">{rows.slice(0, pageSize).map(item => <li className="form-card" key={item.id}>
      <p className="eyebrow">Received {dateLabel.format(item.createdAt)}</p>
      <h2>{item.name}</h2><a className="text-link" href={'tel:' + item.phone}>{item.phone}</a>
      <dl className="inbox-details">
        <dt>Delivery</dt><dd>{dateLabel.format(new Date(item.deliveryDate + 'T00:00:00Z'))}<br/>{item.location} · {item.pin}</dd>
        <dt>Order</dt><dd>{item.litres} L · {rupees(item.litres * PRICE)}<br/>{item.flavours.map(slug => flavours.find(flavour => flavour.slug === slug)?.short ?? slug).join(', ')}</dd>
      </dl>
    </li>)}</ul>
    <nav className="actions" aria-label="Inbox pages">{page > 1 && <a className="button secondary" href={'?page=' + (page - 1)}>Previous page</a>}{rows.length > pageSize && <a className="button" href={'?page=' + (page + 1)}>Next page</a>}</nav>
  </section>;
}
