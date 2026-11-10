import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, getErrorMessage } from "../api.js";

const initialForm = {
  title: "", description: "", location: "", category: "Design", price: "", guests: "2",
  bedrooms: "1", bathrooms: "1", image: "", amenities: "", instantBook: false, freeCancellation: false,
};

export default function HostPage() {
  const { id } = useParams();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    api(`/listings/${id}`)
      .then(({ listing }) => setForm({
        title: listing.title,
        description: listing.description,
        location: listing.location,
        category: listing.category,
        price: String(listing.price),
        guests: String(listing.guests),
        bedrooms: String(listing.bedrooms),
        bathrooms: String(listing.bathrooms),
        image: listing.image,
        amenities: (listing.amenities || []).join(", "),
        instantBook: listing.instantBook === true,
        freeCancellation: listing.freeCancellation === true,
      }))
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, [id]);

  function update(event) {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        guests: Number(form.guests),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        amenities: form.amenities.split(",").map((item) => item.trim()).filter(Boolean),
      };
      const { listing } = await api(id ? `/listings/${id}` : "/listings", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      navigate(`/stays/${listing._id}`);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <main className="host-page"><p>Loading your listing…</p></main>;
  return <main className="host-page"><Link to="/dashboard" className="back-link"><ArrowLeft size={16} /> Your dashboard</Link><div className="host-form-heading"><p className="eyebrow">{id ? "Your place, your way" : "A good place to begin"}</p><h1>{id ? "Update your stay." : "Share your place with Airbnb."}</h1><p>Tell travelers a little about your place. You can always edit the details later.</p></div>
    <form className="host-form" onSubmit={submit}>
      {error && <div className="notice error-notice">{error}</div>}
      <section><span className="form-step">01</span><div className="form-section-content"><h2>Tell us about your place</h2><p>Give your stay a name and a few thoughtful details.</p><label>Listing title<input name="title" value={form.title} onChange={update} placeholder="A sunny little home by the sea" maxLength={120} required /></label><label>Describe your stay<textarea name="description" rows={5} value={form.description} onChange={update} placeholder="What makes this place special?" maxLength={4000} required /></label><div className="form-two-col"><label>Location<input name="location" value={form.location} onChange={update} placeholder="Lisbon, Portugal" maxLength={120} required /></label><label>Stay type<select name="category" value={form.category} onChange={update}>{["Beachfront", "Cabins", "Design", "Countryside", "Pools", "Mountains", "City"].map((item) => <option key={item}>{item}</option>)}</select></label></div></div></section>
      <section><span className="form-step">02</span><div className="form-section-content"><h2>Help guests picture it</h2><p>Share a direct image URL to a photo of your stay.</p><label>Photo URL<span className="input-with-icon"><ImagePlus size={17} /><input type="url" name="image" value={form.image} onChange={update} placeholder="https://example.com/your-stay.jpg" required /></span></label>{form.image && <img className="host-image-preview" src={form.image} alt="Your listing preview" onError={(event) => { event.currentTarget.hidden = true; }} onLoad={(event) => { event.currentTarget.hidden = false; }} />}</div></section>
      <section><span className="form-step">03</span><div className="form-section-content"><h2>Set up the details</h2><p>A few basics help guests decide if it’s right for them.</p><div className="form-three-col"><label>Price per night ($)<input type="number" name="price" value={form.price} onChange={update} min="1" max="100000" required /></label><label>Max guests<input type="number" name="guests" value={form.guests} onChange={update} min="1" max="30" required /></label><label>Bedrooms<input type="number" name="bedrooms" value={form.bedrooms} onChange={update} min="0" max="30" required /></label></div><div className="form-two-col"><label>Bathrooms<input type="number" name="bathrooms" value={form.bathrooms} onChange={update} min="1" max="30" required /></label><label>Amenities, separated by commas<input name="amenities" value={form.amenities} onChange={update} placeholder="Pets allowed, Wi-Fi, Kitchen, Free parking" /></label></div><div className="listing-feature-options"><label><input type="checkbox" name="instantBook" checked={form.instantBook} onChange={update} />Instant Book</label><label><input type="checkbox" name="freeCancellation" checked={form.freeCancellation} onChange={update} />Free cancellation</label></div></div></section>
      <div className="host-form-submit"><span>You can update your listing any time from your dashboard.</span><button className="auth-submit" disabled={submitting}>{submitting ? "Saving…" : id ? "Save changes" : "Publish your  listing"} <ArrowRight size={16} /></button></div>
    </form>
  </main>;
}
