import { useState } from "react";
const BASE_URL = import.meta.env.VITE_API_URL;

type useFetchJourneyProp = {
  query: string;
};

type Coordinates = [number, number] | null; // [longitude, latitude]

export default function useFetchJourney({ query }: useFetchJourneyProp) {
  const [coordinates, setCoordinates] = useState<Coordinates>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJourneys = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call your backend proxy endpoint (no API key here!)
      const response = await fetch(
        `${BASE_URL}/api/geocode?text=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extract coordinates from the first result
      if (data.features && data.features.length > 0) {
        const coords = data.features[0].geometry.coordinates;
        setCoordinates([coords[0], coords[1]]); // [longitude, latitude]
      } else {
        setCoordinates(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching journeys:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    coordinates,
    loading,
    error,
    fetchJourneys,
  };
}
