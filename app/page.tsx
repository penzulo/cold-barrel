import { FlavourGrid, OrderFacts } from '../components/cold-barrel';

export default function Home() {
  return <>
    <section className="wide hero">
      <div className="hero-content">
        <p className="eyebrow">Thick. Creamy. Unforgettable.</p>
        <h1>Thick milkshakes for your next event <em>in Pune.</em></h1>
        <p className="intro">Five thick, creamy flavours for parties, conferences and celebrations. Delivered by the litre, anywhere in Pune.</p>
        <div className="actions"><a className="button" href="/flavours">Explore flavours</a><a className="button secondary" href="/enquiry">Send an enquiry</a></div>
      </div>
      <figure className="hero-image">
        <img src="/photos/hero.webp" srcSet="/photos/hero-small.webp 520w, /photos/hero.webp 864w" sizes="(max-width: 800px) 94vw, 54vw" width="864" height="682" alt="Cold Barrel’s strawberry, blueberry, Oreo, chocolate and cold coffee shakes" fetchPriority="high" />
      </figure>
    </section>
    <div className="wide"><OrderFacts/></div>
    <section className="wide section home-menu"><div className="section-heading"><h2>Find your flavour.</h2><a className="text-link" href="/flavours">View the menu</a></div><FlavourGrid/></section>
    <section className="order-banner"><div className="wide banner-inner"><div><h2>Planning an event?</h2><p>Share your date, location and how many litres you need. We’ll call you to confirm the details.</p></div><a className="button light" href="/enquiry">Send an enquiry</a></div></section>
  </>;
}
