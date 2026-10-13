import assert from "node:assert/strict";
import { ApiError } from "../src/lib/api";
import { toTripApiPayload } from "../src/lib/trip-form";

const payload = toTripApiPayload({
  days: 5,
  nights: 4,
  startingPrice: "1999",
  rating: "4.8",
  isActive: true,
  longDescription: "A longer trip description",
});

assert.equal(payload.startingPrice, 1999);
assert.equal(typeof payload.startingPrice, "number");
assert.equal(payload.rating, 4.8);
assert.equal(typeof payload.rating, "number");
assert.equal(
  new ApiError("Validation failed", 400, { rating: ["Must be a valid number"] }).message,
  "Validation failed: Rating: Must be a valid number",
);