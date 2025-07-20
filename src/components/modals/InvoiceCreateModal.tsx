import { useState, useEffect, useRef } from "react";
import useFetchJourney from "../../hooks/useFetchJourney";
import useFetchDistance from "../../hooks/useFetchDistance";
import PointAtoB from "../PointAtoB";
import { useReactToPrint } from "react-to-print";

interface Trip {
  id: number;
  startAddr: string;
  endAddr: string;
  distance: number;
  duration: number;
  price: number;
}

export default function InvoiceCreateModal() {
  const [clientName, setClientName] = useState<string>("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState({
    startAddr: "",
    endAddr: "",
    distance: 0,
    duration: 0,
    price: 0,
  });
  const [profitMargin, setProfitMargin] = useState<number>(0);
  const [cumulativeTotal, setCumulativeTotal] = useState<number>(0);
  const [petrolCostBreak, setPetrolCostBreak] = useState<number>(0);
  const [manHoursCostBreak, setManHoursCostBreak] = useState<number>(0);
  const [mpgInput, setMpgInput] = useState<number>(40);
  const [pricePerLitreInput, setPricePerLitreInput] = useState<number>(1.45);
  const [hourlyRateInput, setHourlyRateInput] = useState<number>(15);

  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrintButtonClick = useReactToPrint({
    contentRef,
  });

  function calculatePetrolCost(distanceMiles: number) {
    const currentPricePerLitre = pricePerLitreInput;
    const currentMpgInput = mpgInput;
    const litresPerGallon = 4.546; // UK gallon in litres
    const litresPerMile = litresPerGallon / currentMpgInput;
    const litresUsed = litresPerMile * distanceMiles;
    const cost = litresUsed * currentPricePerLitre;
    return cost;
  }

  function calculateManHourCost(hours: number) {
    const hourlyRate = hourlyRateInput;
    return hours * hourlyRate;
  }

  function calculateTripPrice(distance: number, duration: number) {
    const petrolCost = calculatePetrolCost(distance);
    setPetrolCostBreak(Number(petrolCost));
    const manHoursCost = calculateManHourCost(duration / 60);
    setManHoursCostBreak(Number(manHoursCost));
    const price = petrolCost + manHoursCost;
    return Number(price.toFixed(2));
  }

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
        price: calculateTripPrice(calculatedDistance, calculatedDuration),
      }));
    }
  }, [distanceResult]);

  // Update cumulative total when trips change
  useEffect(() => {
    const total = trips.reduce((sum, trip) => sum + trip.price, 0);
    setCumulativeTotal(total);
  }, [trips]);

  function handleGenerateClick(e: React.FormEvent) {
    e.preventDefault();

    if (currentTrip.startAddr.trim().length >= 3) {
      fetchJourneys1();
    }

    if (currentTrip.endAddr.trim().length >= 3) {
      fetchJourneys2();
    }
  }

  function addTrip() {
    if (
      currentTrip.startAddr &&
      currentTrip.endAddr &&
      currentTrip.distance > 0
    ) {
      const price = calculateTripPrice(
        currentTrip.distance,
        currentTrip.duration
      );
      const newTrip: Trip = {
        id: Date.now(),
        startAddr: currentTrip.startAddr,
        endAddr: currentTrip.endAddr,
        distance: currentTrip.distance,
        duration: currentTrip.duration,
        price: price,
      };

      setTrips((prev) => [...prev, newTrip]);
      setCurrentTrip({
        startAddr: "",
        endAddr: "",
        distance: 0,
        duration: 0,
        price: 0,
      });
    }
  }

  useEffect(() => {
    const recalprice = calculateTripPrice(
      currentTrip.distance,
      currentTrip.duration
    );
    setCurrentTrip((prev) => ({ ...prev, price: recalprice }));
  }, [
    currentTrip.distance,
    currentTrip.duration,
    mpgInput,
    pricePerLitreInput,
    hourlyRateInput,
  ]);

  function removeTrip(id: number) {
    setTrips((prev) => prev.filter((trip) => trip.id !== id));
    setCurrentTrip({
      startAddr: "",
      endAddr: "",
      distance: 0,
      duration: 0,
      price: 0,
    });
  }

  function handleClearAllInputs() {
    setCurrentTrip({
      startAddr: "",
      endAddr: "",
      distance: 0,
      duration: 0,
      price: 0,
    });
  }

  function handleResetAllTrips() {
    setProfitMargin(0);
    setClientName("");
    setTrips([]);
    handleClearAllInputs();
    setCumulativeTotal(0);
    // Reset calculation settings to defaults
    setMpgInput(40);
    setPricePerLitreInput(1.45);
    setHourlyRateInput(15);
  }

  return (
    <div className="w-full max-w-4xl lg:max-w-none lg:w-[90%] xl:w-[85%] mx-auto p-4 sm:p-6 lg:p-6 xl:p-8 bg-white">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          Trip Calculation Helper
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            onClick={handleResetAllTrips}
          >
            Full Reset
          </button>
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            onClick={handleClearAllInputs}
          >
            Clear Current Trip
          </button>
        </div>
      </div>

      <form className="space-y-6 lg:space-y-8">
        {/* Client Name */}
        <div>
          <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2 lg:mb-3">
            Client Name
          </label>
          <input
            type="text"
            value={clientName}
            className="w-full px-3 py-2 lg:px-4 lg:py-3 lg:text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter client name"
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>

        {/* Add New Trip Section */}
        <div className="border-2 border-blue-200 rounded-lg p-4 lg:p-6 space-y-4 lg:space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Add New Trip</h3>

          <PointAtoB
            startAddr={currentTrip.startAddr}
            endAddr={currentTrip.endAddr}
            setEndAddr={(addr) =>
              setCurrentTrip((prev) => ({ ...prev, endAddr: addr }))
            }
            setStartAddr={(addr) =>
              setCurrentTrip((prev) => ({ ...prev, startAddr: addr }))
            }
            handleGenerateClick={handleGenerateClick}
          />

          {/* Distance and Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2 lg:mb-3">
                Distance (miles)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 lg:px-4 lg:py-3 lg:text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                value={currentTrip.distance || ""}
                step={0.5}
                onChange={(e) =>
                  setCurrentTrip((prev) => ({
                    ...prev,
                    distance: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2 lg:mb-3">
                Duration (minutes)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 lg:px-4 lg:py-3 lg:text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                value={currentTrip.duration || ""}
                step={1}
                onChange={(e) =>
                  setCurrentTrip((prev) => ({
                    ...prev,
                    duration: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          {/* Calculation Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 lg:mb-3">
                <label className="text-sm lg:text-base font-medium text-gray-700">
                  MPG
                </label>
                {mpgInput !== 40 && (
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full"></div>
                )}
              </div>
              <input
                type="number"
                className="w-full px-3 py-2 lg:px-4 lg:py-3 lg:text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={mpgInput}
                onChange={(e) => setMpgInput(Number(e.target.value))}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 lg:mb-3">
                <label className="text-sm lg:text-base font-medium text-gray-700">
                  Price per Litre (£)
                </label>
                {pricePerLitreInput !== 1.45 && (
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full"></div>
                )}
              </div>
              <input
                type="number"
                step={0.01}
                className="w-full px-3 py-2 lg:px-4 lg:py-3 lg:text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={pricePerLitreInput}
                onChange={(e) => setPricePerLitreInput(Number(e.target.value))}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 lg:mb-3">
                <label className="text-sm lg:text-base font-medium text-gray-700">
                  Hourly Rate (£)
                </label>
                {hourlyRateInput !== 15 && (
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full"></div>
                )}
              </div>
              <input
                type="number"
                step={0.01}
                className="w-full px-3 py-2 lg:px-4 lg:py-3 lg:text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={hourlyRateInput}
                onChange={(e) => setHourlyRateInput(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Estimated Trip Cost - Prominently Styled */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 lg:gap-4">
              <label className="text-lg lg:text-xl font-semibold text-gray-800">
                Estimated Trip Cost:
              </label>
              <div className="flex items-center gap-2 lg:gap-3">
                <span className="text-2xl lg:text-3xl font-bold text-green-600">
                  £{currentTrip.price.toFixed(2)}
                </span>
                <input
                  type="number"
                  step={0.01}
                  className="w-24 lg:w-32 px-2 py-1 lg:px-3 lg:py-2 text-lg lg:text-xl font-semibold text-center border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={currentTrip.price}
                  onChange={(e) =>
                    setCurrentTrip((prev) => ({
                      ...prev,
                      price: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          {(petrolCostBreak > 0 || manHoursCostBreak > 0) && (
            <div className="bg-gray-50 p-3 lg:p-4 rounded-md">
              <h4 className="text-sm lg:text-base font-medium text-gray-700 mb-2 lg:mb-3">
                Cost Breakdown:
              </h4>
              <div className="text-sm lg:text-base text-gray-600 space-y-1 lg:space-y-2">
                {petrolCostBreak > 0 && (
                  <div>Petrol Cost: £{petrolCostBreak.toFixed(2)}</div>
                )}
                {manHoursCostBreak > 0 && (
                  <div>Labour Cost: £{manHoursCostBreak.toFixed(2)}</div>
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={addTrip}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 lg:py-4 lg:px-6 lg:text-lg rounded-md transition-colors font-medium"
          >
            Add Trip to Invoice
          </button>
        </div>

        {/* Profit Margin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Profit Margin
          </label>
          <select
            value={profitMargin}
            onChange={(e) => setProfitMargin(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>0% (No Profit)</option>
            <option value={10}>10%</option>
            <option value={20}>20%</option>
            <option value={30}>30%</option>
            <option value={40}>40%</option>
          </select>
        </div>

        {/* Added Trips List */}
        {trips.length > 0 && (
          <div className="border-2 border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Added Trips ({trips.length})
            </h3>
            <div className="space-y-3">
              {trips.map((trip) => (
                <div key={trip.id} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">
                        {trip.startAddr} → {trip.endAddr}
                      </div>
                      <div className="text-sm text-gray-600">
                        {trip.distance} miles • {trip.duration} minutes
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className="font-semibold text-lg">
                        £{trip.price.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTrip(trip.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className="text-lg font-semibold text-gray-800">
              Total Invoice Amount:
            </span>
            <span className="text-2xl font-bold text-blue-600">
              £{(cumulativeTotal * (1 + profitMargin / 100)).toFixed(2)}
            </span>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {trips.length} trip{trips.length !== 1 ? "s" : ""} • {profitMargin}%
            profit margin
          </div>
        </div>

        {/* Print Button */}
        <div className="flex justify-center">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            onClick={(e) => {
              e.preventDefault();
              handlePrintButtonClick();
            }}
          >
            Print PDF
          </button>
        </div>
      </form>

      {/* Print Content */}
      <div ref={contentRef} className="hidden print:block">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6">Invoice</h1>
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Client: {clientName}</h2>
          </div>
          <div className="space-y-4">
            {trips.map((trip, idx) => (
              <div key={trip.id} className="border-b pb-4">
                <h3 className="font-semibold">Trip {idx + 1}</h3>
                <p>From: {trip.startAddr}</p>
                <p>To: {trip.endAddr}</p>
                <p>Distance: {trip.distance} miles</p>
                <p>Duration: {trip.duration} minutes</p>
                <p className="font-semibold">Price: £{trip.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t-2">
            <div className="text-right">
              <p className="text-lg">Subtotal: £{cumulativeTotal.toFixed(2)}</p>
              <p className="text-lg">Profit Margin: {profitMargin}%</p>
              <p className="text-xl font-bold">
                Total: £
                {(cumulativeTotal * (1 + profitMargin / 100)).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
