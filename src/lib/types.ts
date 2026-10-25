export type TravelMode = "solo" | "group";
export type TravelType = "solo" | "group" | "both";
export type SharingKind = "double" | "triple" | "quad";
export type InclusionKind = "included" | "excluded";
export type BatchStatus = "available" | "limited" | "soldout" | "inactive";
export type BookingStatus = "draft" | "confirmed" | "cancelled" | "expired";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type DiscountKind = "flat" | "percent";
export type StoryCategory = "solo" | "couple" | "group";

export interface TripImage { id: number; imageKey: string; imageUrl: string; altText: string | null; sortOrder: number }
export interface ItineraryDay { id: number; dayNumber: number; title: string; description: string }
export interface Inclusion { id: number; label: string; kind: InclusionKind; sortOrder: number }
export interface SharingType { id: number; kind: SharingKind; price: string; description?: string | null }
export interface Batch {
  id: number;
  startDate: string;
  endDate: string;
  totalSeats: number;
  seatsBooked: number;
  status: BatchStatus;
}
export interface Trip {
  id: number;
  title: string;
  slug: string;
  city: string;
  state: string;
  days: number;
  nights: number;
  startingPrice: string;
  shortDescription: string;
  longDescription?: string;
  rating: string;
  travelType: TravelType;
  isFeatured: boolean;
  featuredOrder: number | null;
  isActive: boolean;
  images: TripImage[];
  itineraryDays: ItineraryDay[];
  inclusions: Inclusion[];
  sharingTypes: SharingType[];
  batches: Batch[];
}

export interface TeamMember { id: number; name: string; isActive: boolean; sortOrder: number }

export interface StoryImage {
  id: number;
  imageKey: string;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
}

export interface Story {
  id: number;
  title: string;
  content: string;
  category: StoryCategory;
  travellerName: string;
  coverImageKey?: string;
  coverImageUrl: string;
  travellerAvatarUrl: string | null;
  tripLabel: string | null;
  rating: string;
  images: StoryImage[];
  createdAt: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface Member {
  id?: number;
  fullName: string;
  age: number;
  gender: "male" | "female" | "other";
  phone: string;
  email: string;
  address: string;
  medicalCondition?: string | null;
  isPrimary: boolean;
  aadharFrontKey?: string | null;
  aadharBackKey?: string | null;
}

export interface Booking {
  id: number;
  bookingRef: string;
  travelMode: TravelMode;
  groupSize: number;
  baseAmount: string;
  discountAmount: string;
  gstAmount: string;
  totalAmount: string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  trip: Pick<Trip, "id" | "title" | "slug">;
  batch: Batch;
  sharingType: SharingType;
  members: Member[];
  invoice?: { id: number; invoiceNumber: string; pdfKey: string } | null;
  coupon?: { code: string } | null;
}

export interface Coupon {
  id: number;
  code: string;
  discountKind: DiscountKind;
  discountValue: string;
  maxDiscount?: string | null;
  minAmount?: string | null;
  usageLimit?: number | null;
  usageCount?: number;
  validFrom?: string | null;
  validTo?: string | null;
  isActive: boolean;
}

export interface DashboardStats {
  totalBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  activeTrips: number;
  activeCoupons: number;
  upcomingBatches: Array<{
    id: number;
    tripTitle: string;
    startDate: string;
    seatsBooked: number;
    totalSeats: number;
    occupancyPercent: number;
    status: BatchStatus;
  }>;
}
