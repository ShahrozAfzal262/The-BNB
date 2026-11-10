import { BedDouble, Compass, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const collections = {
  hotels: {
    title: "Hotels",
    eyebrow: "A good night's stay",
    description: "Find the right hotel for your next trip. Hotel listings will appear here when the collection is ready.",
    icon: BedDouble,
  },
  experiences: {
    title: "Experiences",
    eyebrow: "Make the trip your own",
    description: "Discover local things to do. Experiences will appear here when you add their details.",
    icon: Sparkles,
  },
};

export default function CollectionPage({ section }) {
  const collection = collections[section];
  const Icon = collection.icon;

  return (
    <main className="collection-page">
      <div className="collection-intro">
        <p className="eyebrow">{collection.eyebrow}</p>
        <h1>{collection.title}, your way.</h1>
        <p>{collection.description}</p>
      </div>
      <div className="collection-empty">
        <span className="collection-icon"><Icon size={28} /></span>
        <p className="eyebrow">A new collection is on its way</p>
        <h2>This page is ready for your {section}.</h2>
        <p>Add your {section} details when they’re ready, and they’ll have a home here.</p>
        <Link className="outline-button" to="/">Explore all stays <Compass size={15} /></Link>
      </div>
    </main>
  );
}
