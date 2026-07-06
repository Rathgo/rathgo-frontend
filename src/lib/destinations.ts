import manali from "@/assets/dest-manali.jpg";
import sissu from "@/assets/dest-sissu.jpg";
import dharamshala from "@/assets/dest-dharamshala.jpg";

export type Destination = {
  slug: string;
  name: string;
  state: string;
  image: string;
  description: string;
  days: string;
  price: number;
  type: string;
  rating: number;
};

export const destinations: Destination[] = [
  {
    slug: "manali",
    name: "Manali",
    state: "Himachal Pradesh",
    image: manali,
    description: "Snowy peaks, apple orchards and adventure sports in the heart of the mountains.",
    days: "5 Days / 4 Nights",
    price: 8999,
    type: "Both",
    rating: 4.9,
  },
  {
    slug: "sissu",
    name: "Sissu",
    state: "Lahaul Valley",
    image: sissu,
    description: "A hidden gem with waterfalls, snow fields and breathtaking Himalayan views.",
    days: "4 Days / 3 Nights",
    price: 7499,
    type: "Both",
    rating: 4.8,
  },
  {
    slug: "dharamshala",
    name: "Dharamshala",
    state: "Himachal Pradesh",
    image: dharamshala,
    description: "Tibetan culture, monasteries and pine forests with serene mountain trails.",
    days: "4 Days / 3 Nights",
    price: 6999,
    type: "Both",
    rating: 4.9,
  },
];

export const bySlug = (slug: string) => destinations.find((d) => d.slug === slug);
