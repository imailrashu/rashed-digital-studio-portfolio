import type { BusinessKnowledge } from '../data/business'

export type QuickAction = { label: string; kind: 'question' | 'link'; value: string }

const normalize = (value: string) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
const includesAny = (message: string, terms: string[]) => terms.some((term) => message.includes(term))

const contactFallback = (business: BusinessKnowledge) => {
  if (business.whatsapp) return `${business.assistant.fallback} WhatsApp: ${business.whatsapp}.`
  if (business.phone) return business.assistant.fallback
  if (business.email) return `${business.assistant.fallback} Email: ${business.email}.`
  return business.assistant.fallback
}

export function answerFromLocalKnowledge(input: string, business: BusinessKnowledge): string {
  const message = normalize(input)
  if (!message) return business.assistant.welcome

  const matchedFaq = business.faq.find((item) => item.keywords.some((keyword) => message.includes(normalize(keyword))))
  if (matchedFaq) return matchedFaq.answer

  if (includesAny(message, ['hello', 'hi', 'hey', 'good morning', 'good evening'])) return business.assistant.welcome

  if (includesAny(message, ['service', 'offer', 'treatment', 'menu', 'haircut', 'facial', 'makeup'])) {
    if (business.services.length === 0) return contactFallback(business)
    return `The confirmed services currently listed are ${business.services.map((service) => service.name).join(', ')}.`
  }

  if (includesAny(message, ['hour', 'open', 'close', 'timing', 'when can i visit'])) {
    return business.hours.length > 0 ? business.hours.join(' ') : contactFallback(business)
  }

  if (includesAny(message, ['price', 'cost', 'rate', 'fee', 'how much', 'discount'])) {
    const priced = business.services.filter((service) => service.price)
    return priced.length > 0 ? priced.map((service) => `${service.name}: ${service.price}`).join(' · ') : contactFallback(business)
  }

  if (includesAny(message, ['address', 'location', 'where', 'direction', 'map', 'visit'])) {
    return business.address ? `${business.businessName} is publicly listed at ${business.address}.` : contactFallback(business)
  }

  if (includesAny(message, ['whatsapp', 'message'])) {
    return business.whatsapp ? `The confirmed WhatsApp number is ${business.whatsapp}.` : contactFallback(business)
  }

  if (includesAny(message, ['phone', 'call', 'contact number', 'number'])) {
    return business.phone ? `The public phone number listed for ${business.businessName} is ${business.phone}.` : contactFallback(business)
  }

  if (includesAny(message, ['email', 'mail'])) {
    return business.email ? `The confirmed email address is ${business.email}.` : contactFallback(business)
  }

  if (includesAny(message, ['book', 'appointment', 'reserve', 'schedule', 'slot', 'availability'])) {
    if (business.bookingUrl) return 'You can use the Book Appointment action to open the confirmed booking page.'
    return `I can't confirm a booking or current availability. ${contactFallback(business)}`
  }

  if (includesAny(message, ['who are you', 'are you human', 'assistant', 'bot'])) {
    return `I'm the ${business.assistant.name}, a digital assistant using the verified information configured for this private website demo.`
  }

  if (includesAny(message, ['about', 'business', 'salon', 'style zone'])) {
    return `${business.businessName} is publicly listed as a ${business.category} in ${business.location}.`
  }

  return contactFallback(business)
}

export function buildQuickActions(business: BusinessKnowledge): QuickAction[] {
  const actions: QuickAction[] = []
  if (business.services.length > 0) actions.push({ label: 'View Services', kind: 'question', value: 'What services are available?' })
  if (business.bookingUrl) actions.push({ label: 'Book Appointment', kind: 'link', value: business.bookingUrl })
  if (business.whatsappHref) actions.push({ label: 'WhatsApp Us', kind: 'link', value: business.whatsappHref })
  if (business.phoneHref) actions.push({ label: 'Call Now', kind: 'link', value: business.phoneHref })
  if (business.directionsUrl) actions.push({ label: 'Location', kind: 'link', value: business.directionsUrl })
  return actions
}
