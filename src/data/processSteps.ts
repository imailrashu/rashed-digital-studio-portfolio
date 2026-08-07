export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  detail: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery",
    description:
      "Understand the business, services, customers, goals and current digital presence.",
    detail:
      "We establish what the website needs to communicate and what visitors should be able to do.",
  },
  {
    number: "02",
    title: "Strategy",
    description:
      "Plan the page structure, messaging, user journey and key calls to action.",
    detail:
      "The website gets a clear hierarchy before visual design or development begins.",
  },
  {
    number: "03",
    title: "Design",
    description:
      "Create the visual direction, responsive layouts and interaction system.",
    detail:
      "Typography, spacing, hierarchy and motion work together to support the business.",
  },
  {
    number: "04",
    title: "Development",
    description:
      "Build the responsive interface, integrations and interactive experience.",
    detail:
      "The website is implemented, tested and refined across desktop, tablet and mobile.",
  },
  {
    number: "05",
    title: "Launch & Support",
    description:
      "Deploy the website, connect the required services and support the launch.",
    detail:
      "The final project is checked for usability, links, integrations and production readiness.",
  },
];
