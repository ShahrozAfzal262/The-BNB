import ListingRail from "./ListingRail.jsx";
import { exploreLink } from "../hooks/useListings.js";

export default function SimilarDatesCarousel() {
  const title = "Available for similar dates";
  return (
    <ListingRail
      title={title}
      ariaLabel="Stays available for similar dates"
      sectionClass="nearby-section similar-dates-section"
      headingClass="similar-dates-heading"
      seeAllClass="similar-dates-see-all"
      query={{ collection: "similar-dates" }}
      exploreTo={exploreLink({ collection: "similar-dates", title })}
    />
  );
}
