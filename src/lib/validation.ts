export type MemberLike = {
  fullName: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address?: string;
};

export type TripFormNumericFields = {
  title: string;
  slug: string;
  city: string;
  state: string;
  days: number;
  nights: number;
  startingPrice: string;
  shortDescription: string;
  rating?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Returns a list of human-readable problems with a traveller's details (empty = valid). */
export function memberValidationErrors(m: MemberLike): string[] {
  const errors: string[] = [];
  const name = m.fullName?.trim() ?? "";
  if (!name) errors.push("Full name is required.");
  else if (name.length < 2) errors.push("Full name must be at least 2 characters.");

  const email = m.email?.trim() ?? "";
  if (!email) errors.push("Email address is required.");
  else if (!EMAIL_RE.test(email)) errors.push(`"${email}" is not a valid email address (example: name@gmail.com).`);

  const phone = (m.phone ?? "").replace(/[\s-]/g, "");
  const digits = phone.replace(/\D/g, "");
  if (!digits) errors.push("Phone number is required.");
  else if (digits.length < 10) errors.push("Phone number must have at least 10 digits (include your full mobile number).");
  else if (digits.length > 13) errors.push("Phone number is too long — enter a 10-digit mobile number, with country code if needed.");

  const age = Number(m.age);
  if (!Number.isFinite(age) || Number.isNaN(age) || age <= 0) errors.push("Age must be a positive number (e.g. 25). Age cannot be zero or negative.");
  else if (age > 120) errors.push("Age must be 120 or less — please check the entered age.");

  return errors;
}

/** Returns a list of human-readable problems with the trip form values (empty = valid). */
export function tripFormValidationErrors(v: TripFormNumericFields): string[] {
  const errors: string[] = [];
  if (!v.title.trim()) errors.push("Title is required.");
  if (!v.city.trim()) errors.push("City is required.");
  if (!v.state.trim()) errors.push("State is required.");

  const slug = v.slug.trim();
  if (!slug) errors.push("Slug is required (the URL part, e.g. manali-batch-trip).");
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    errors.push("Slug can only contain lowercase letters, numbers and hyphens (e.g. manali-batch-trip). No spaces or capital letters.");

  if (!Number.isFinite(v.days) || v.days < 1) errors.push("Days must be at least 1.");
  if (!Number.isFinite(v.nights) || v.nights < 0) errors.push("Nights cannot be negative.");
  if (v.days > 0 && v.nights > 0 && v.nights >= v.days) errors.push("Nights should be less than Days for a typical trip (e.g. 5 Days / 4 Nights).");

  const price = Number(v.startingPrice);
  if (!v.startingPrice.trim() || !Number.isFinite(price) || price <= 0)
    errors.push("Starting Price must be a number greater than 0 (enter digits only, e.g. 1999).");

  if (v.rating !== undefined && String(v.rating).trim() !== "") {
    const rating = Number(v.rating);
    if (!Number.isFinite(rating) || rating < 0 || rating > 5)
      errors.push("Rating must be a number between 0 and 5 (e.g. 4.8).");
  }

  if (!v.shortDescription.trim()) errors.push("Short Description is required.");

  return errors;
}

/** Turns a list of problems into a single readable message. */
export function joinValidationErrors(errors: string[]): string {
  return errors.join(" ");
}
