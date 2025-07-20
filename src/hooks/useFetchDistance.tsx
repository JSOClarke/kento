import { useState } from "react";
const BASE_URL = import.meta.env.VITE_API_URL;
type Coordinates = [number, number]; // [longitude, latitude]

type useFetchDistanceProp = {
  startCoords: Coordinates | null;
  endCoords: Coordinates | null;
};

interface DistanceResult {
  distance: number; // in meters
  duration: number; // in seconds
  fullResponse: any; // Full API response for accessing other properties
}

export default function useFetchDistance({
  startCoords,
  endCoords,
}: useFetchDistanceProp) {
  const [distanceResult, setDistanceResult] = useState<DistanceResult | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDistance = async () => {
    if (!startCoords || !endCoords) {
      setError("Both start and end coordinates are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Format coordinates as "longitude,latitude"
      const start = `${startCoords[0]},${startCoords[1]}`;
      const end = `${endCoords[0]},${endCoords[1]}`;

      // Call your backend proxy endpoint
      const response = await fetch(
        `${BASE_URL}/api/directions?start=${encodeURIComponent(
          start
        )}&end=${encodeURIComponent(end)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extract distance and duration from the response
      if (data.features && data.features.length > 0) {
        const route = data.features[0];
        const distance = route.properties.segments[0].distance; // in meters
        const duration = route.properties.segments[0].duration; // in seconds

        setDistanceResult({
          distance,
          duration,
          fullResponse: data,
        });
      } else {
        setError("No route found between the coordinates");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching distance:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    distanceResult,
    loading,
    error,
    fetchDistance,
  };
}
