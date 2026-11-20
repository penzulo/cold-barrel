import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import { flavours } from '../../../lib/cold-barrel';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const flavour = flavours.find(item => item.slug === slug);
  return flavour ? { title: flavour.name, description: flavour.description } : {};
}

export function generateStaticParams() {
  return flavours.map(({ slug }) => ({ slug }));
}

export default async function FlavourPage({ params }: Props) {
  const { slug } = await params;
  const flavour = flavours.find(item => item.slug === slug);
  if (!flavour) notFound();
  return <section className="wide section detail">
    <div>
      <a href="/flavours" className="text-link">All flavours</a>
      <h1>{flavour.name}</h1><p className="intro">{flavour.description}</p>
      <p className="detail-price">₹300 <span>per litre</span></p>
      <p>5-litre minimum. Order at least 2 days in advance.<br/>Pune delivery charged separately.</p>
      <a className="button" href={'/enquiry?flavour=' + flavour.slug}>Enquire about this flavour</a>
    </div>
    <figure className="detail-image" style={{ '--accent': flavour.colour } as CSSProperties}><img src={'/photos/' + flavour.slug + '.webp'} alt={flavour.name}/></figure>
  </section>;
}
