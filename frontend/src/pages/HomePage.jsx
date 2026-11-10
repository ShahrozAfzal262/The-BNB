import LahoreSearchCarousel from "../components/LahoreSearchCarousel.jsx";
import BahriaTownCarousel from "../components/BahriaTownCarousel.jsx";
import FreeCancellationCarousel from "../components/FreeCancellationCarousel.jsx";
import SimilarDatesCarousel from "../components/SimilarDatesCarousel.jsx";
import DestinationsCarousel from "../components/DestinationsCarousel.jsx";
import TravelInspiration from "../components/TravelInspiration.jsx";

export default function HomePage() {
  return (
    <>
      <LahoreSearchCarousel featured />
      <BahriaTownCarousel />
      <FreeCancellationCarousel />
      <SimilarDatesCarousel />
      <DestinationsCarousel />
      <TravelInspiration />
    </>
  );
}
