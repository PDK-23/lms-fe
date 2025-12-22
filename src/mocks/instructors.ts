import { type Instructor } from "@/types";

export const MOCK_INSTRUCTORS: Instructor[] = [
  {
    id: "1",
    name: "Sarah Smith",
    avatar: "https://placehold.co/128x128?text=Sarah",
    bio: "Experienced instructor with 15+ years in tech",
    rating: 4.8,
    totalRatings: 2500,
    students: 50000,
    isVerified: true,
  },
  {
    id: "2",
    name: "John Doe",
    avatar: "https://placehold.co/128x128?text=John",
    bio: "Business consultant and course creator",
    rating: 4.7,
    totalRatings: 1800,
    students: 35000,
    isVerified: true,
  },
  {
    id: "3",
    name: "Emily Chen",
    avatar: "https://placehold.co/128x128?text=Emily",
    bio: "AI and Machine Learning specialist",
    rating: 4.9,
    totalRatings: 3200,
    students: 60000,
    isVerified: true,
  },
  {
    id: "4",
    name: "Michael Brown",
    avatar: "https://placehold.co/128x128?text=Michael",
    bio: "Creative designer and UX expert",
    rating: 4.6,
    totalRatings: 1500,
    students: 28000,
    isVerified: true,
  },
  {
    id: "5",
    name: "Lisa Anderson",
    avatar: "https://placehold.co/128x128?text=Lisa",
    bio: "Data scientist and analyst",
    rating: 4.8,
    totalRatings: 2100,
    students: 45000,
    isVerified: true,
  },
];

export default MOCK_INSTRUCTORS;
