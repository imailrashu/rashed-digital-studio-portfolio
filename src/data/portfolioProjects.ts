export type PortfolioProject = {
  slug: string;
  name: string;
  category: string;
  classification: string;
  description: string;
  features: string[];
  eyebrow: string;
  desktopImage?: string;
  mobileImage?: string;
  demoUrl?: string;
  caseStudy: {
    challenge: string;
    approach: string;
    designDirection: string;
    keyFeatures: string;
    responsiveStrategy: string;
    outcomeTitle: "Outcome / purpose" | "What this concept demonstrates";
    outcome: string;
  };
};

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "atoz-interior",
    name: "A to Z Interior",
    category: "Interior Design",
    classification: "Client Project",
    eyebrow: "Interior design · Kolkata",
    desktopImage: "/projects/atoz-interior/desktop.png",
    mobileImage: "/projects/atoz-interior/mobile.png",
    demoUrl: "https://azharatozinterior.com",
    description:
      "A responsive business website designed to present interior-design services, project visuals and company information while making customer enquiries easier.",
    features: [
      "Responsive website design",
      "Services presentation",
      "Project gallery",
      "WhatsApp integration",
      "Lead enquiry flow",
      "Domain and deployment support",
    ],
    caseStudy: {
      challenge:
        "Present a broad interior-design offering clearly while keeping project imagery and enquiry actions easy to reach.",
      approach:
        "Organise the experience around services, visual proof, company context and direct customer actions.",
      designDirection:
        "A warm, image-led business presentation with confident typography and restrained premium details.",
      keyFeatures:
        "Responsive service pages, project gallery, WhatsApp enquiry path and deployment-ready business information.",
      responsiveStrategy:
        "Prioritise readable service summaries, touch-friendly contact actions and carefully cropped project imagery on smaller screens.",
      outcomeTitle: "Outcome / purpose",
      outcome:
        "A production website that gives prospective customers a clearer way to understand the studio and start an enquiry.",
    },
  },

  {
    slug: "style-check-salon",
    name: "Style Check Family Salon",
    category: "Salon & Beauty",
    classification: "Concept Project",
    eyebrow: "Beauty · Local business",
    desktopImage: "/projects/style-check/desktop.png",
    mobileImage: "/projects/style-check/mobile.png",
    demoUrl: "/concepts/style-check/index.html",
    description:
      "A premium salon website concept focused on service discovery, booking calls to action, mobile usability and stronger local-business credibility.",
    features: [
      "Service catalogue",
      "Booking calls to action",
      "WhatsApp integration",
      "Mobile-first interface",
      "Location information",
      "Business-focused layout",
    ],
    caseStudy: {
      challenge:
        "Create an elevated family-salon experience without relying on ratings, invented stylists or unsupported beauty claims.",
      approach:
        "Use service discovery, editorial storytelling and transparent demo-safe booking paths to create confidence.",
      designDirection:
        "Warm ivory, muted rose and charcoal combine with serif typography, layered photography and quiet motion.",
      keyFeatures:
        "Service catalogue, signature rituals, transformation presentation, expert-role architecture, gallery and booking CTA.",
      responsiveStrategy:
        "Recompose editorial collages, simplify navigation and stack high-value booking content from 320px upward.",
      outcomeTitle: "What this concept demonstrates",
      outcome:
        "A premium beauty website can feel editorial and distinctive while remaining practical, truthful and easy to navigate.",
    },
  },

  {
    slug: "flowpilot",
    name: "FlowPilot AI Agency",
    category: "AI Automation",
    classification: "Personal Project",
    eyebrow: "Automation · Lead generation",
    desktopImage: "/projects/flowpilot/desktop.png",
    mobileImage: "/projects/flowpilot/mobile.png",
    demoUrl: "https://flowpilotdemo.netlify.app",
    description:
      "A modern automation-agency experience built around service presentation, personalized demonstrations, lead capture and client outreach.",
    features: [
      "Automation services",
      "Lead-capture experience",
      "Personalized demos",
      "Calendly integration",
      "Responsive interface",
      "Conversion-focused messaging",
    ],
    caseStudy: {
      challenge:
        "Explain an abstract automation offer through a modern experience that still gives visitors clear next steps.",
      approach:
        "Translate service categories into focused sections, demonstration paths and direct lead-capture actions.",
      designDirection:
        "A dark, technology-led visual system using depth, motion and precise cyan accents.",
      keyFeatures:
        "Automation service architecture, personalised demo concept, Calendly connection and responsive lead flow.",
      responsiveStrategy:
        "Keep demonstrations legible, maintain CTA prominence and simplify layered visuals for narrow screens.",
      outcomeTitle: "Outcome / purpose",
      outcome:
        "A personal project showing how technical services can be positioned through a coherent, conversion-aware interface.",
    },
  },

  {
    slug: "fitness-experience",
    name: "Premium Fitness Experience",
    category: "Fitness",
    classification: "Concept Project",
    eyebrow: "Fitness · Membership",
    desktopImage: "/projects/fitness/desktop.png",
    mobileImage: "/projects/fitness/mobile.png",
    demoUrl: "/concepts/fitness/index.html",
    description:
      "A bold digital concept for a fitness business featuring programs, schedules, coaching, memberships and strong trial-booking calls to action.",
    features: [
      "Class schedules",
      "Coach profiles",
      "Membership presentation",
      "Trial booking",
      "Strong mobile experience",
      "High-energy visual system",
    ],
    caseStudy: {
      challenge:
        "Give a functional-fitness business high energy without using invented member counts, ratings or transformation statistics.",
      approach:
        "Make programs, schedule, coaching philosophy and trial actions the evidence for the experience.",
      designDirection:
        "Concrete grey, deep charcoal and safety yellow support condensed typography and kinetic training imagery.",
      keyFeatures:
        "Interactive schedule, program pathways, membership layout, coach-role profiles, event concept and trial form.",
      responsiveStrategy:
        "Collapse dense schedules, keep typography controlled and preserve one-thumb access to the trial CTA on mobile.",
      outcomeTitle: "What this concept demonstrates",
      outcome:
        "A bold fitness website can communicate coaching structure and community energy without making unverified performance claims.",
    },
  },

  {
    slug: "local-service-growth",
    name: "Local Service Growth",
    category: "Local Business",
    classification: "Concept Project",
    eyebrow: "Services · Local growth",
    desktopImage: "/projects/local-service/desktop.png",
    mobileImage: "/projects/local-service/mobile.png",
    demoUrl: "/concepts/local-service/index.html",
    description:
      "A flexible business website framework for service providers that need greater credibility, clearer services and easier customer enquiries.",
    features: [
      "Service presentation",
      "Local contact information",
      "Trust-focused sections",
      "Enquiry flow",
      "WhatsApp integration",
      "Responsive design",
    ],
    caseStudy: {
      challenge:
        "Build trust for a fictional local-service brand without fake reviews, ratings, response times or an invented operating address.",
      approach:
        "Use process clarity, service scope, contact choice and visual proof architecture as the trust system.",
      designDirection:
        "Warm white and navy create a reassuring base, with clean blue structure and restrained green action states.",
      keyFeatures:
        "Services grid, illustrative coverage map, four-step process, work gallery, FAQ, contact paths and enquiry form.",
      responsiveStrategy:
        "Surface the quote path early, stack service information cleanly and retain practical touch targets at every breakpoint.",
      outcomeTitle: "What this concept demonstrates",
      outcome:
        "A local-business website can create credibility through clarity and usability instead of fabricated social proof.",
    },
  },

  {
    slug: "conversion-landing-page",
    name: "Premium Conversion Landing Page",
    category: "Landing Page",
    classification: "Independent Redesign Concept",
    eyebrow: "Landing page · Conversion design",
    desktopImage: "/projects/landing-page/desktop.png",
    mobileImage: "/projects/landing-page/mobile.png",
    demoUrl: "/concepts/conversion-landing/index.html",
    description:
      "An independent redesign concept demonstrating stronger visual hierarchy, focused messaging, responsive structure and clearer calls to action.",
    features: [
      "Focused messaging",
      "Clear calls to action",
      "Responsive layout",
      "Lead form structure",
      "Performance-conscious design",
      "Refined visual hierarchy",
    ],
    caseStudy: {
      challenge:
        "Position a fictional workflow product convincingly without fake customers, usage data or implied integration partnerships.",
      approach:
        "Build the narrative from problem to interface, workflow, architecture, pricing structure and final action.",
      designDirection:
        "Near-black surfaces, soft white typography and restrained cyan create a precise product environment with limited glass effects.",
      keyFeatures:
        "Interactive dashboard, cursor lighting, workflow stepper, interface cards, integration concept, pricing layout and FAQ.",
      responsiveStrategy:
        "Reduce dashboard density intentionally, protect type hierarchy and keep product interactions usable from 320px upward.",
      outcomeTitle: "What this concept demonstrates",
      outcome:
        "A conversion landing page can balance a strong product story with believable interface detail and explicit concept transparency.",
    },
  },
];
