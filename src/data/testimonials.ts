export type Testimonial = {
  name: string;
  role: string;
  company: string;
  quote: string;
  photo: string;
  verified: boolean;
};

export const testimonials: Testimonial[] = [];

export const verifiedTestimonials = testimonials.filter(
  (testimonial) => testimonial.verified === true,
);
