import LahoreSearchCarousel from "../components/LahoreSearchCarousel.jsx";
import BahriaTownCarousel from "../components/BahriaTownCarousel.jsx";
import SimilarDatesCarousel from "../components/SimilarDatesCarousel.jsx";
import FreeCancellationCarousel from "../components/FreeCancellationCarousel.jsx";
import DestinationsCarousel from "../components/DestinationsCarousel.jsx";
import TravelInspiration from "../components/TravelInspiration.jsx";

export default function AllPage() {
  return (
    <>
      <LahoreSearchCarousel />
      <BahriaTownCarousel />
      <SimilarDatesCarousel />
      <FreeCancellationCarousel />
      <DestinationsCarousel />
      <TravelInspiration />
    </>
  );
}
