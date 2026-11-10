import ListingRail from "./ListingRail.jsx";
import { exploreLink } from "../hooks/useListings.js";

export default function BahriaTownCarousel() {
  const title = "Stay near Bahria Town";
  return (
    <ListingRail
      title={title}
      subtitle="Lahore suburb with parks and cafes"
      ariaLabel="Stays near Bahria Town"
      sectionClass="nearby-section home-bahria-section"
      query={{ collection: "bahria" }}
      exploreTo={exploreLink({ collection: "bahria", title })}
    />
  );
}
