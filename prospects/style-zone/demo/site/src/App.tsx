import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { business } from './data/business'

const BusinessChatbot = lazy(() => import('./components/BusinessChatbot'))
const phoneDisplay = business.phone ?? 'Phone not confirmed'
const phoneHref = business.phoneHref ?? '#contact'
const directionsHref = business.directionsUrl ?? '#visit'

function useReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  useReveal()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !menuOpen) return
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="proposal-bar" role="note">
        Private website proposal <span aria-hidden="true">·</span> Not the official Style Zone website
      </div>

      <header className="site-header">
        <a className="brand" href="#home" aria-label="Style Zone proposal home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">SZ</span>
          <span className="brand-copy"><strong>Style Zone</strong><small>Dhakuria · Kolkata</small></span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#experience">Experience</a>
          <a href="#visit">Visit</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="header-cta" href={phoneHref}>Call the salon <span aria-hidden="true">↗</span></a>

        <button
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span />
        </button>

        <nav id="mobile-navigation" className={`mobile-nav${menuOpen ? ' is-open' : ''}`} aria-label="Mobile navigation">
          <a href="#experience" onClick={closeMenu}>Experience</a>
          <a href="#visit" onClick={closeMenu}>Visit</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
          <a href={phoneHref} onClick={closeMenu}>Call {phoneDisplay}</a>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="home">
          <div className="hero-copy" data-reveal>
            <p className="eyebrow">Salon · Dhakuria · Kolkata</p>
            <h1><span>STYLE</span><em>ZONE.</em></h1>
            <p className="hero-lead">A clearer digital welcome for a neighbourhood salon.</p>
            <p className="hero-note">This private concept demonstrates how Style Zone’s verified Dhakuria location and public phone contact could become one focused, mobile-friendly customer journey.</p>
            <div className="hero-actions">
              <a className="button button-dark" href={phoneHref}>Call Style Zone <span aria-hidden="true">↗</span></a>
              <a className="text-link" href={directionsHref} target="_blank" rel="noopener noreferrer">Get directions <span aria-hidden="true">↗</span></a>
            </div>
          </div>

          <div className="hero-visual" data-reveal>
            <figure className="hero-image hero-image-main">
              <img src="/images/salon-interior.jpg" width="1600" height="1067" fetchPriority="high" alt="Licensed concept photograph of a salon interior, not the Style Zone premises" />
              <figcaption>Concept imagery · Not the actual premises</figcaption>
            </figure>
            <figure className="hero-image hero-image-detail">
              <img src="/images/salon-detail.jpg" width="1200" height="1800" loading="eager" alt="Licensed concept photograph of a salon styling space, not the Style Zone premises" />
            </figure>
            <div className="hero-seal" aria-hidden="true"><span>Private</span><strong>Website</strong><small>Proposal / 01</small></div>
          </div>

          <a className="scroll-cue" href="#experience">Explore the concept <span aria-hidden="true">↓</span></a>
        </section>

        <section className="intro section" id="experience">
          <header className="section-heading" data-reveal>
            <p className="eyebrow">The opportunity</p>
            <h2>ONE PLACE.<br /><em>CLEARER NEXT STEPS.</em></h2>
            <p>Public listings establish Style Zone’s salon category and Dhakuria address. An owned website could bring those essentials into a clearer presentation while confirmed services, hours and brand content are added directly by the salon.</p>
          </header>

          <div className="fact-strip" data-reveal>
            <article><span>01</span><small>Business</small><strong>Salon & personal care</strong></article>
            <article><span>02</span><small>Location</small><strong>Dhakuria, Kolkata</strong></article>
            <article><span>03</span><small>Public contact</small><strong>{phoneDisplay}</strong></article>
          </div>
        </section>

        <section className="journey section" aria-labelledby="journey-title">
          <header className="journey-heading" data-reveal>
            <p className="eyebrow">Proposed customer journey</p>
            <h2 id="journey-title">FROM DISCOVERY<br />TO CONVERSATION.</h2>
          </header>

          <div className="journey-list">
            <article data-reveal><span>01</span><div><h3>Recognise the salon</h3><p>Lead with the Style Zone name and the verified Dhakuria location instead of making visitors piece identity together across directories.</p></div><b aria-hidden="true">↗</b></article>
            <article data-reveal><span>02</span><div><h3>Explore confirmed details</h3><p>A production version could present services, prices, hours and original imagery only after the salon confirms them.</p></div><b aria-hidden="true">↗</b></article>
            <article data-reveal><span>03</span><div><h3>Choose the next step</h3><p>Keep the publicly listed phone and the verified street address easy to reach on every screen size.</p></div><b aria-hidden="true">↗</b></article>
          </div>
        </section>

        <section className="editorial-panel" aria-label="Concept visual presentation">
          <figure className="editorial-image" data-reveal>
            <img src="/images/salon-detail.jpg" width="1200" height="1800" loading="lazy" decoding="async" alt="Licensed stock photograph used only to demonstrate an editorial salon website direction" />
            <figcaption>Licensed concept photograph · Not Style Zone staff or premises</figcaption>
          </figure>
          <div className="editorial-copy" data-reveal>
            <p className="eyebrow">Editorial direction</p>
            <h2>A CALMER WAY<br /><em>TO BE FOUND.</em></h2>
            <p>Warm editorial typography, direct actions and restrained motion create a premium proposal without inventing what the salon offers.</p>
            <dl>
              <div><dt>Known</dt><dd>Business name, category, street address and one public phone</dd></div>
              <div><dt>To confirm</dt><dd>Services, prices, hours, booking method, postcode and original imagery</dd></div>
            </dl>
          </div>
        </section>

        <section className="visit section" id="visit">
          <div className="location-card" data-reveal aria-hidden="true">
            <div className="map-grid" />
            <span className="map-ring map-ring-one" />
            <span className="map-ring map-ring-two" />
            <span className="map-pin">SZ</span>
            <small>Dhakuria<br />Kolkata</small>
          </div>

          <div className="visit-copy" data-reveal>
            <p className="eyebrow">Publicly listed location</p>
            <h2>STYLE ZONE,<br />DHAKURIA.</h2>
            <address>Flat GB, Chhayaneer Apartment<br />28/1C Gariahat Road<br />Kankulia, Dhakuria, Kolkata</address>
            <p className="verification-note">The street address is corroborated across two public directories. Their postcode values conflict, so the postcode is intentionally omitted pending confirmation.</p>
            <div className="visit-actions">
              <a className="button button-dark" href={directionsHref} target="_blank" rel="noopener noreferrer">Open directions <span aria-hidden="true">↗</span></a>
              <a className="text-link" href={phoneHref}>Call {phoneDisplay}</a>
            </div>
          </div>
        </section>

        <section className="confirm section" aria-labelledby="confirm-title">
          <header data-reveal>
            <p className="eyebrow">Before a real launch</p>
            <h2 id="confirm-title">CONFIRM THE DETAILS.<br /><em>THEN MAKE IT YOURS.</em></h2>
          </header>
          <div className="confirm-grid" data-reveal>
            <span>Services & pricing</span><span>Opening hours</span><span>Booking preference</span><span>Phone & WhatsApp</span><span>Correct postcode</span><span>Original brand imagery</span>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-inner" data-reveal>
            <p className="eyebrow">Public contact</p>
            <h2>START WITH<br /><em>A CONVERSATION.</em></h2>
            <p>The number below appears in a public directory and should be confirmed by Style Zone before a production launch.</p>
            <a className="contact-phone" href={phoneHref}>{phoneDisplay} <span aria-hidden="true">↗</span></a>
          </div>
        </section>
      </main>

      <footer>
        <a className="brand brand-footer" href="#home" aria-label="Back to Style Zone proposal home"><span className="brand-mark" aria-hidden="true">SZ</span><span className="brand-copy"><strong>Style Zone</strong><small>Private proposal</small></span></a>
        <p>Website demonstration by Rashed Digital Studio.<br />Not the official Style Zone website.</p>
        <a className="footer-top" href="#home">Back to top <span aria-hidden="true">↑</span></a>
      </footer>

      <Suspense fallback={null}>
        <BusinessChatbot business={business} />
      </Suspense>
    </>
  )
}

export default App
