export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
  service: string;
  date: string;
  status: 'approved' | 'pending';
}

export const testimonialsList: TestimonialItem[] = [
  {
    id: 't-1',
    name: 'Rahul S.',
    location: 'Pune',
    rating: 5,
    quote: 'The guidance I received was truly life-changing. I got clarity about my career and future.',
    service: 'Career Guidance',
    date: '15 Jan 2025',
    status: 'approved',
  },
  {
    id: 't-2',
    name: 'Priya M.',
    location: 'Mumbai',
    rating: 5,
    quote: 'Very accurate predictions and practical remedies. Highly recommended!',
    service: 'Marriage & Compatibility',
    date: '12 Jan 2025',
    status: 'approved',
  },
  {
    id: 't-3',
    name: 'Amit K.',
    location: 'Nashik',
    rating: 5,
    quote: 'A genuine astrologer with deep knowledge. The consultation was very helpful.',
    service: 'General Consultation',
    date: '08 Jan 2025',
    status: 'approved',
  },
  {
    id: 't-4',
    name: 'Sneha P.',
    location: 'Nagpur',
    rating: 5,
    quote: 'The Vastu guidance completely transformed the energy in our home without any demolition.',
    service: 'Vastu Consultation',
    date: '02 Jan 2025',
    status: 'approved',
  },
];

