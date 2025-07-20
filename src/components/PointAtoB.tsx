import { useState, useEffect } from "react";
import type { Trip } from "../types/types";
import { nanoid } from "nanoid";
import useFetchDistance from "../hooks/useFetchDistance";
import useFetchJourney from "../hooks/useFetchJourney";
import { calculateTripPricing } from "../utils/pricingUtils";

export default function PointAtoB() {
  const [startAddr, setStartAddr] = useState<string>("");
  const [endAddr, setEndAddr] = useState<string>("");
  const [currentTrip, setCurrentTrip] = useState<Trip>({
    id: nanoid(),
    startAddr: "",
    endAddr: "",
    distance: 0,
    duration: 0,
    price: 0.0,
    mpg: 40,
    pricePerLitre: 1.45,
    hourlyRate: 15,
  });

  const { coordinates: coordinates1, fetchJourneys: fetchJourneys1 } =
    useFetchJourney({ query: currentTrip.startAddr });

  const { coordinates: coordinates2, fetchJourneys: fetchJourneys2 } =
    useFetchJourney({ query: currentTrip.endAddr });

  const { distanceResult, fetchDistance } = useFetchDistance({
    startCoords: coordinates1,
    endCoords: coordinates2,
  });

  useEffect(() => {
    if (coordinates1 && coordinates2) {
      fetchDistance();
    }
  }, [coordinates1, coordinates2]);

  useEffect(() => {
    if (distanceResult) {
      const calculatedDistance = Number(
        (distanceResult.distance / 1609.34).toFixed(2)
      );
      const calculatedDuration = Math.round(distanceResult.duration / 60);

      setCurrentTrip((prev) => ({
        ...prev,
        distance: calculatedDistance,
        duration: calculatedDuration,
        price: calculateTripPricing({
          distanceMiles: calculatedDistance,
          durationMinutes: calculatedDuration,
          pricePerLitre: currentTrip.pricePerLitre,
          mpg: currentTrip.mpg,
          hourlyRate: currentTrip.hourlyRate,
        }).total,
      }));
    }
  }, [distanceResult]);

  function handleGenerateClick(e: React.FormEvent) {
    e.preventDefault();

    if (currentTrip.startAddr.trim().length >= 3) {
      fetchJourneys1();
    }

    if (currentTrip.endAddr.trim().length >= 3) {
      fetchJourneys2();
    }
  }

  useEffect(() => {
    const recalprice = calculateTripPricing({
      distanceMiles: currentTrip.distance,
      durationMinutes: currentTrip.duration,
      pricePerLitre: currentTrip.pricePerLitre,
      mpg: currentTrip.mpg,
      hourlyRate: currentTrip.hourlyRate,
    });
    setCurrentTrip((prev) => ({ ...prev, price: recalprice.total }));
  }, [
    currentTrip.distance,
    currentTrip.duration,
    currentTrip.mpg,
    currentTrip.pricePerLitre,
    currentTrip.hourlyRate,
  ]);

  return (
    <>
      <div className="postcode-input flex w-full justify-between gap-10">
        <div className="point-1-address-container flex-1">
          <label className="field-label block text-sm font-medium text-gray-700 mb-1">
            Point 1 Address/Postcode
          </label>
          <input
            type="text"
            className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="TW45ND"
            value={currentTrip.startAddr}
            onChange={(e) =>
              setCurrentTrip((prev) => ({ ...prev, startAddr: e.target.value }))
            }
          />
        </div>

        <div className="point-1-address-container flex-1">
          <label className="field-label block text-sm font-medium text-gray-700 mb-1">
            Point 2 Address/Postcode
          </label>
          <input
            type="text"
            value={currentTrip.endAddr}
            onChange={(e) =>
              setCurrentTrip((prev) => ({ ...prev, endAddr: e.target.value }))
            }
            className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0L99XP"
          />
        </div>
      </div>
      <div className="calculator-inputs flex flex-col">
        <label className="field-label block text-sm font-medium text-gray-700 mb-1">
          MPG
        </label>
        <input
          type="number"
          value={currentTrip.mpg}
          onChange={(e) =>
            setCurrentTrip((prev) => ({ ...prev, mpg: Number(e.target.value) }))
          }
          className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0L99XP"
        />
        <label className="field-label block text-sm font-medium text-gray-700 mb-1">
          Price Per Litre
        </label>
        <input
          type="number"
          value={currentTrip.pricePerLitre}
          onChange={(e) =>
            setCurrentTrip((prev) => ({
              ...prev,
              pricePerLitre: Number(e.target.value),
            }))
          }
          className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0L99XP"
        />
        <label className="field-label block text-sm font-medium text-gray-700 mb-1">
          Hourly Rate
        </label>
        <input
          type="number"
          value={currentTrip.hourlyRate}
          onChange={(e) =>
            setCurrentTrip((prev) => ({
              ...prev,
              hourlyRate: Number(e.target.value),
            }))
          }
          className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0L99XP"
        />
      </div>
      <div className="generate-distance-button ">
        <button
          onClick={(e) => handleGenerateClick(e)}
          className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
        >
          Generate Approximate Distance Calculation
        </button>
        <label>Estimated Amount</label>
        <input
          type="number"
          value={currentTrip.price}
          onChange={(e) =>
            setCurrentTrip((prev) => ({
              ...prev,
              price: Number(e.target.value),
            }))
          }
          className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </>
  );
}
