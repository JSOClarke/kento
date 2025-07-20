type TripPricingInput = {
  distanceMiles: number;
  durationMinutes: number;
  pricePerLitre: number;
  mpg: number;
  hourlyRate: number;
};

type TripPricingResult = {
  petrolCost: number;
  manHourCost: number;
  total: number;
};

export function calculateTripPricing({
  distanceMiles,
  durationMinutes,
  pricePerLitre,
  mpg,
  hourlyRate,
}: TripPricingInput): TripPricingResult {
  const litresPerGallon = 4.546; // UK gallon
  const litresPerMile = litresPerGallon / mpg;
  const litresUsed = litresPerMile * distanceMiles;
  const petrolCost = litresUsed * pricePerLitre;

  const hours = durationMinutes / 60;
  const manHourCost = hours * hourlyRate;

  const total = petrolCost + manHourCost;

  return {
    petrolCost: Number(petrolCost.toFixed(2)),
    manHourCost: Number(manHourCost.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}
