type TripFormNumericFields = {
  days: number;
  nights: number;
  startingPrice: string;
  rating?: string;
  isActive: boolean;
};

export function toTripApiPayload<T extends TripFormNumericFields>(values: T) {
  const { startingPrice, rating, ...otherFields } = values;
  return {
    ...otherFields,
    startingPrice: Number(startingPrice),
    rating: rating ? Number(rating) : undefined,
  };
}