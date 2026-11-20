import { FlavourGrid } from '../../components/cold-barrel';

export const metadata = { title: 'Flavours' };

export default function Menu() {
  return <section className="wide section page-top"><p className="eyebrow">The Cold Barrel menu</p><h1>Find your flavour.</h1><p className="intro">Five thick, creamy favourites, all ₹300 per litre.</p><FlavourGrid/></section>;
}
