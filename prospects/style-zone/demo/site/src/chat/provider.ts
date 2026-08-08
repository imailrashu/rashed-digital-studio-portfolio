import type { BusinessKnowledge } from '../data/business'

type ProviderResponse = { answer?: unknown }

export async function answerFromOptionalProvider(message: string, business: BusinessKnowledge): Promise<string | null> {
  if (import.meta.env.VITE_CHAT_MODE !== 'ai') return null
  const endpoint = import.meta.env.VITE_CHAT_API_URL?.trim()
  if (!endpoint) return null

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      business: {
        businessName: business.businessName,
        category: business.category,
        location: business.location,
        address: business.address,
        phone: business.phone,
        hours: business.hours,
        services: business.services,
        bookingUrl: business.bookingUrl,
        verifiedFacts: business.verifiedFacts,
        unknownFacts: business.unknownFacts,
        faq: business.faq,
      },
    }),
  })

  if (!response.ok) return null
  const data = (await response.json()) as ProviderResponse
  return typeof data.answer === 'string' && data.answer.trim() ? data.answer.trim() : null
}
