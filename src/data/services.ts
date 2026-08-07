export type ServiceItem = {
  number: string;
  title: string;
  description: string;
  value: string;
  previewTitle: string;
  previewLines: string[];
};

export const services: ServiceItem[] = [
  {
    number: "01",
    title: "Business Website Design",
    description:
      "Professional business websites designed around your services, audience and customer journey.",
    value:
      "For businesses that need a credible, modern online presence.",
    previewTitle: "Business Website",
    previewLines: [
      "Clear service presentation",
      "Professional brand experience",
      "Strong enquiry journey",
    ],
  },

  {
    number: "02",
    title: "Landing Page Design",
    description:
      "Focused landing pages built around one clear offer, message and customer action.",
    value:
      "Ideal for campaigns, services, offers and lead generation.",
    previewTitle: "Conversion Landing Page",
    previewLines: [
      "Focused messaging",
      "Clear calls to action",
      "Conversion-focused structure",
    ],
  },

  {
    number: "03",
    title: "Website Redesign",
    description:
      "Modern redesigns for websites that feel outdated, unclear or difficult to use on mobile.",
    value:
      "Improve presentation without losing the core identity of the business.",
    previewTitle: "Website Redesign",
    previewLines: [
      "Improved clarity",
      "Updated visual direction",
      "Better responsive behavior",
    ],
  },

  {
    number: "04",
    title: "Responsive Front-End Development",
    description:
      "Modern front-end implementation designed to work properly across desktop, tablet and mobile.",
    value:
      "For designs and businesses that need a polished responsive build.",
    previewTitle: "Responsive Development",
    previewLines: [
      "Desktop",
      "Tablet",
      "Mobile",
    ],
  },

  {
    number: "05",
    title: "Booking & WhatsApp Integration",
    description:
      "Connect practical customer actions including WhatsApp, Calendly, booking tools and contact options.",
    value:
      "Make it easier for customers to contact or book with your business.",
    previewTitle: "Customer Actions",
    previewLines: [
      "WhatsApp",
      "Calendly / booking tools",
      "Enquiry actions",
    ],
  },

  {
    number: "06",
    title: "Lead Forms & Automation",
    description:
      "Structured enquiry forms and basic automation workflows that help capture and organize incoming leads.",
    value:
      "Useful for service businesses that want a clearer enquiry process.",
    previewTitle: "Lead Flow",
    previewLines: [
      "Enquiry capture",
      "Structured lead flow",
      "Workflow integration",
    ],
  },

  {
    number: "07",
    title: "Interactive / 3D Web Experiences",
    description:
      "Purposeful interactive visuals, scroll-driven motion and 3D experiences for brands that need something more distinctive.",
    value:
      "Best for premium brands, portfolios and visually ambitious projects.",
    previewTitle: "Interactive Experience",
    previewLines: [
      "WebGL",
      "GSAP motion",
      "Scroll-driven experiences",
    ],
  },
];
