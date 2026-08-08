export type BusinessService = {
  name: string
  description?: string
  price?: string
}

export type BusinessFaq = {
  question: string
  answer: string
  keywords: string[]
}

export type BusinessKnowledge = {
  businessName: string
  slug: string
  category: string
  location: string
  address: string | null
  phone: string | null
  phoneHref: string | null
  whatsapp: string | null
  whatsappHref: string | null
  email: string | null
  hours: string[]
  services: BusinessService[]
  bookingUrl: string | null
  directionsUrl: string | null
  socialLinks: Array<{ label: string; href: string }>
  verifiedFacts: Array<{ label: string; value: string; sourceIds: string[] }>
  unknownFacts: string[]
  faq: BusinessFaq[]
  sections: { services: string | null; contact: string | null; location: string | null }
  assistant: { name: string; persona: string; welcome: string; fallback: string }
  demo: { isProposal: true; disclosure: string }
}

export const business: BusinessKnowledge = {
  businessName: 'Style Zone',
  slug: 'style-zone',
  category: 'salon and personal-care business',
  location: 'Dhakuria, Kolkata',
  address: 'Flat GB, Chhayaneer Apartment, 28/1C Gariahat Road, Kankulia, Dhakuria, Kolkata',
  phone: '+91 98046 77597',
  phoneHref: 'tel:+919804677597',
  whatsapp: null,
  whatsappHref: null,
  email: null,
  hours: [],
  services: [],
  bookingUrl: null,
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Style%20Zone%2028%2F1C%20Gariahat%20Road%20Kankulia%20Dhakuria%20Kolkata',
  socialLinks: [],
  verifiedFacts: [
    { label: 'Business name', value: 'Style Zone', sourceIds: ['S01', 'S02'] },
    { label: 'Category', value: 'Salon / beauty and personal-care business', sourceIds: ['S01', 'S02'] },
    { label: 'Location', value: 'Dhakuria, Kolkata', sourceIds: ['S01', 'S02'] },
    { label: 'Street address', value: 'Flat GB, Chhayaneer Apartment, 28/1C Gariahat Road, Kankulia, Dhakuria, Kolkata', sourceIds: ['S01', 'S02'] },
    { label: 'Public phone', value: '+91 98046 77597', sourceIds: ['S01'] },
  ],
  unknownFacts: [
    'Detailed services and prices',
    'Opening hours',
    'Booking and walk-in policy',
    'WhatsApp availability',
    'Email address',
    'Correct postcode',
    'Team, credentials, awards, history, and business results',
  ],
  faq: [
    {
      question: 'Where is Style Zone located?',
      answer: 'Style Zone is publicly listed at Flat GB, Chhayaneer Apartment, 28/1C Gariahat Road, Kankulia, Dhakuria, Kolkata.',
      keywords: ['where are you', 'where is style zone', 'location', 'address', 'directions'],
    },
    {
      question: 'What services are available?',
      answer: "A detailed service menu is not confirmed in this demo. You can call the team at +91 98046 77597 for the latest information.",
      keywords: ['services', 'service menu', 'treatments', 'haircut', 'beauty service'],
    },
    {
      question: 'What are the opening hours?',
      answer: "The opening hours are not confirmed in this demo. You can call +91 98046 77597 for the latest information.",
      keywords: ['opening hours', 'hours', 'timings', 'open today', 'closing time'],
    },
  ],
  sections: {
    services: '#experience',
    contact: '#contact',
    location: '#visit',
  },
  assistant: {
    name: 'Style Zone virtual assistant',
    persona: 'Friendly, polished salon digital receptionist using verified demo knowledge only',
    welcome: "Hello—I'm the virtual assistant for this private Style Zone website demo. I can help with the confirmed Dhakuria location and public phone details.",
    fallback: "I don't have that information confirmed yet. You can call the team at +91 98046 77597 for the latest details.",
  },
  demo: {
    isProposal: true,
    disclosure: 'Private website proposal — not the official Style Zone website.',
  },
}
