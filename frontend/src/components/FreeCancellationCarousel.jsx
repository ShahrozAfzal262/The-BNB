import ListingRail from "./ListingRail.jsx";
import { exploreLink } from "../hooks/useListings.js";

export default function FreeCancellationCarousel() {
  const title = "Lahore homes with free cancellation";
  return (
    <ListingRail
      title={title}
      ariaLabel="Lahore homes with free cancellation"
      sectionClass="nearby-section free-cancellation-section home-free-cancellation-section"
      query={{ collection: "free-cancellation" }}
      exploreTo={exploreLink({ collection: "free-cancellation", title })}
    />
  );
}
