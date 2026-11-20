'use client';

import { useRef, useState, type FormEvent } from 'react';
import { flavours, MIN_LITRES, PRICE, PHONE, PHONE_LINK, rupees } from '../../lib/cold-barrel';

export default function EnquiryForm({ selected, minDate }: { selected?: string; minDate: string }) {
  const [litres, setLitres] = useState(String(MIN_LITRES));
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const retry = useRef({ id: '', details: '' });
  const amount = Number(litres);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError('');
    const data = new FormData(event.currentTarget);
    const selectedFlavours = data.getAll('flavours');
    if (!selectedFlavours.length) {
      setError('Choose at least one preferred flavour.');
      event.currentTarget.querySelector<HTMLInputElement>('input[name="flavours"]')?.focus();
      return;
    }
    const details = {
      name: data.get('name'), phone: data.get('phone'), location: data.get('location'),
      pin: data.get('pin'), deliveryDate: data.get('deliveryDate'), litres: amount,
      flavours: selectedFlavours,
    };
    const serialized = JSON.stringify(details);
    if (retry.current.details !== serialized) retry.current = { id: crypto.randomUUID(), details: serialized };
    setPending(true);
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...details, id: retry.current.id }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) {
        setError(result.error || 'Your enquiry could not be saved. Please try again.');
        return;
      }
      setSaved(true);
    } catch {
      setError('Your enquiry could not be saved. Please try again.');
    } finally {
      setPending(false);
    }
  }

  return <div className="enquiry-grid">
    <div className="form-card">
      {saved ? <div role="status" className="confirmation"><h2>Enquiry received</h2><p>Thanks for your enquiry! The Cold Barrel team will call you to confirm availability, your order details, and the delivery charge.</p><a className="text-link" href="/flavours">Back to flavours</a></div> :
      <form onSubmit={submit}>
        <fieldset disabled={pending} className="form-fields"><legend>Tell us about your order</legend>
          <div className="input-grid">
            <label>Full name<input required name="name" autoComplete="name" maxLength={100} /></label>
            <label>Phone number<input required name="phone" type="tel" autoComplete="tel" maxLength={25} placeholder="+91" /></label>
            <label>Pune delivery location<input required name="location" autoComplete="street-address" maxLength={240} placeholder="Address or locality" /></label>
            <label>PIN code<input required name="pin" inputMode="numeric" autoComplete="postal-code" pattern="[1-9][0-9]{5}" maxLength={6} /></label>
            <label>Preferred delivery date<input required name="deliveryDate" type="date" min={minDate} aria-describedby="date-note" /><small id="date-note">At least 2 days ahead.</small></label>
            <label>Total litres required<input required name="litres" type="number" min={MIN_LITRES} step="any" value={litres} onChange={event => setLitres(event.target.value)} /><small>Minimum 5 litres.</small></label>
          </div>
          <fieldset className="flavour-picker"><legend>Preferred flavours</legend><p>Choose one or more. We’ll confirm your selection when we call.</p>
            <div className="choices">{flavours.map(({ slug, short }) => <label key={slug}><input type="checkbox" name="flavours" value={slug} defaultChecked={slug === selected}/>{short}</label>)}</div>
          </fieldset>
          {error && <p className="error" role="alert">{error}</p>}
          <button type="submit" className="button">{pending ? 'Sending enquiry…' : 'Submit enquiry'}</button>
        </fieldset>
      </form>}
    </div>
    <aside className="estimate"><h2>Your estimate</h2><dl><div><dt>Price per litre</dt><dd>{rupees(PRICE)}</dd></div>
      <div><dt>Quantity</dt><dd>{amount > 0 ? amount + ' L' : '—'}</dd></div></dl>
      <div className="estimate-total"><span>Beverage subtotal</span><output aria-live="polite">{amount > 0 && Number.isFinite(amount * PRICE) ? rupees(amount * PRICE) : '—'}</output></div>
      <p>Delivery charged separately.</p><hr/><p>Questions? <a href={PHONE_LINK}>{PHONE}</a></p>
    </aside>
  </div>;
}
