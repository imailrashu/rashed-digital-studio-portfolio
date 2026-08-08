import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { BusinessKnowledge } from '../data/business'
import { answerFromLocalKnowledge, buildQuickActions } from '../chat/localKnowledge'
import { answerFromOptionalProvider } from '../chat/provider'
import './chatbot.css'

type ChatMessage = { id: number; role: 'assistant' | 'visitor'; text: string }

export default function BusinessChatbot({ business }: { business: BusinessKnowledge }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [{ id: 1, role: 'assistant', text: business.assistant.welcome }])
  const launcherRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(2)
  const quickActions = useMemo(() => buildQuickActions(business), [business])

  const close = () => {
    setOpen(false)
    window.requestAnimationFrame(() => launcherRef.current?.focus())
  }

  const show = () => {
    setOpen(true)
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      window.requestAnimationFrame(() => launcherRef.current?.focus())
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: reduced ? 'auto' : 'smooth' })
  }, [messages, open])

  const submitMessage = async (raw: string) => {
    const message = raw.trim()
    if (!message || busy) return
    setMessages((current) => [...current, { id: nextId.current++, role: 'visitor', text: message }])
    setInput('')
    setBusy(true)
    try {
      const providerAnswer = await answerFromOptionalProvider(message, business)
      const answer = providerAnswer ?? answerFromLocalKnowledge(message, business)
      setMessages((current) => [...current, { id: nextId.current++, role: 'assistant', text: answer }])
    } catch {
      setMessages((current) => [...current, { id: nextId.current++, role: 'assistant', text: answerFromLocalKnowledge(message, business) }])
    } finally {
      setBusy(false)
      window.requestAnimationFrame(() => inputRef.current?.focus())
    }
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submitMessage(input)
  }

  return (
    <div className="business-chatbot">
      {open ? (
        <section className="chat-panel" role="dialog" aria-modal="false" aria-labelledby="chat-title" aria-describedby="chat-description">
          <header className="chat-header">
            <div className="chat-identity"><span className="chat-status" aria-hidden="true" /><div><strong id="chat-title">{business.businessName}</strong><small id="chat-description">Virtual assistant · Verified demo knowledge</small></div></div>
            <button className="chat-close" type="button" onClick={close} aria-label="Close Style Zone virtual assistant">×</button>
          </header>

          <div ref={logRef} className="chat-log" role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((message) => <p key={message.id} className={`chat-bubble is-${message.role}`}>{message.text}</p>)}
            {busy ? <p className="chat-bubble is-assistant is-thinking">Checking verified information…</p> : null}
          </div>

          <div className="chat-actions" aria-label="Quick actions">
            {quickActions.map((action) => action.kind === 'link' ? (
              <a key={action.label} href={action.value} target={action.value.startsWith('http') ? '_blank' : undefined} rel={action.value.startsWith('http') ? 'noopener noreferrer' : undefined}>{action.label}</a>
            ) : (
              <button key={action.label} type="button" onClick={() => void submitMessage(action.value)}>{action.label}</button>
            ))}
          </div>

          <form className="chat-form" onSubmit={onSubmit}>
            <label className="visually-hidden" htmlFor="style-zone-chat-input">Ask the Style Zone virtual assistant</label>
            <input ref={inputRef} id="style-zone-chat-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about verified details…" autoComplete="off" disabled={busy} />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send message">Send</button>
          </form>
          <p className="chat-disclosure">Digital demo assistant · Unconfirmed details are never guessed.</p>
        </section>
      ) : null}

      <button
        ref={launcherRef}
        className={`chat-launcher${open ? ' is-hidden' : ''}`}
        type="button"
        onClick={show}
        aria-label="Open Style Zone virtual assistant"
        aria-expanded={open}
        aria-hidden={open}
        tabIndex={open ? -1 : 0}
      ><span aria-hidden="true">Ask</span><strong>Style Zone</strong></button>
    </div>
  )
}
