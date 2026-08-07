import {
  type FormEvent,
  type PointerEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  CalendarDays,
  Mail,
  MessageCircle,
} from "lucide-react";

import { siteConfig } from "../data/siteConfig";
import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type EnquiryField =
  | "name"
  | "business"
  | "email"
  | "phone"
  | "websiteType"
  | "budget"
  | "timeline"
  | "message";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [invalidFields, setInvalidFields] = useState<Set<string>>(
    () => new Set(),
  );
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-v5-kicker, .contact-v5-intro",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-v5-heading",
            start: "top 82%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".contact-v5-title-line > span",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-v5-heading",
            start: "top 80%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".contact-v5-visual",
        { y: 38, scale: 0.965, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-v5-grid",
            start: "top 84%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".contact-v5-method",
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-v5-methods",
            start: "top 88%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".contact-v5-form",
        { y: 46, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-v5-form",
            start: "top 86%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  function handleVisualPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

    const element = visualRef.current;
    if (!element) return;

    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    element.style.setProperty("--contact-pointer-x", `${x * 100}%`);
    element.style.setProperty("--contact-pointer-y", `${y * 100}%`);
    element.style.setProperty("--contact-rotate-x", `${(0.5 - y) * 3}deg`);
    element.style.setProperty("--contact-rotate-y", `${(x - 0.5) * 3}deg`);
  }

  function resetVisualPointer() {
    const element = visualRef.current;
    if (!element) return;

    element.style.setProperty("--contact-pointer-x", "50%");
    element.style.setProperty("--contact-pointer-y", "50%");
    element.style.setProperty("--contact-rotate-x", "0deg");
    element.style.setProperty("--contact-rotate-y", "0deg");
  }

  function clearFieldError(name: EnquiryField, isValid: boolean) {
    if (!isValid || !invalidFields.has(name)) return;

    setInvalidFields((current) => {
      const next = new Set(current);
      next.delete(name);
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const fields = Array.from(
      form.querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >("input, select, textarea"),
    );
    const invalid = fields.filter((field) => !field.checkValidity());

    if (invalid.length > 0) {
      setInvalidFields(new Set(invalid.map((field) => field.name)));
      invalid[0].focus();
      return;
    }

    setInvalidFields(new Set());

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const business = String(data.get("business") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const websiteType = String(data.get("websiteType") || "").trim();
    const budget = String(data.get("budget") || "").trim();
    const timeline = String(data.get("timeline") || "").trim();
    const message = String(data.get("message") || "").trim();

    const enquiry = `Hi Rashed,

I found Rashed Digital Studio through your portfolio and would like to discuss a website project.

Name: ${name}
Business: ${business || "Not provided"}
Email: ${email}
WhatsApp / Phone: ${phone || "Not provided"}
Website type: ${websiteType}
Budget: ${budget || "Not selected"}
Timeline: ${timeline || "Not selected"}

Project details:
${message}`;

    const whatsappBase = siteConfig.whatsapp.split("?")[0];

    window.open(
      `${whatsappBase}?text=${encodeURIComponent(enquiry)}`,
      "_blank",
      "noopener,noreferrer",
    );

    setSubmitted(true);
  }

  const fieldError = (name: EnquiryField, message: string) =>
    invalidFields.has(name) ? (
      <small className="contact-v5-field-error" id={`${name}-error`}>
        {message}
      </small>
    ) : null;

  return (
    <section className="contact-section-v5" id="contact" ref={sectionRef}>
      <header className="contact-v5-heading">
        <span className="section-kicker contact-v5-kicker">
          Start a project
        </span>

        <h2>
          <span className="contact-v5-title-line">
            <span>Have a project worth</span>
          </span>
          <span className="contact-v5-title-line">
            <span>making unforgettable?</span>
          </span>
        </h2>

        <p className="contact-v5-intro">
          Tell me what you are building, redesigning or trying to improve. We
          can start with a simple conversation.
        </p>
      </header>

      <div className="contact-v5-grid">
        <div className="contact-v5-information">
          <div
            className="contact-v5-visual"
            ref={visualRef}
            role="img"
            aria-label="Rashed Digital Studio contact identity system"
            onPointerMove={handleVisualPointerMove}
            onPointerLeave={resetVisualPointer}
          >
            <span className="contact-v5-coordinate contact-v5-coordinate-top">
              RDS / CONTACT NODE 05
            </span>
            <span className="contact-v5-coordinate contact-v5-coordinate-side">
              22.5726° N / 88.3639° E
            </span>

            <div className="contact-v5-orbit-stage" aria-hidden="true">
              <div className="contact-v5-ring contact-v5-ring-one" />
              <div className="contact-v5-ring contact-v5-ring-two" />
              <div className="contact-v5-ring contact-v5-ring-three" />
              <div className="contact-v5-axis contact-v5-axis-x" />
              <div className="contact-v5-axis contact-v5-axis-y" />

              <div className="contact-v5-core">
                <small>RDS / 05</small>
                <span>
                  LET&apos;S
                  <br />
                  BUILD
                </span>
              </div>

              <span className="contact-v5-node contact-v5-node-one" />
              <span className="contact-v5-node contact-v5-node-two" />
              <span className="contact-v5-node contact-v5-node-three" />
              <span className="contact-v5-node contact-v5-node-four" />
            </div>

            <div className="contact-v5-visual-footer" aria-hidden="true">
              <span>Project signal</span>
              <strong>OPEN</strong>
              <small>Kolkata · Worldwide</small>
            </div>
          </div>

          <nav className="contact-v5-methods" aria-label="Contact methods">
            <a
              className="contact-v5-method"
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-v5-method-icon">
                <MessageCircle size={18} aria-hidden="true" />
              </span>
              <span className="contact-v5-method-copy">
                <small>WhatsApp</small>
                <strong>+91 75950 65151</strong>
              </span>
              <ArrowUpRight className="contact-v5-method-arrow" size={17} aria-hidden="true" />
            </a>

            <a
              className="contact-v5-method"
              href={siteConfig.calendly}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-v5-method-icon">
                <CalendarDays size={18} aria-hidden="true" />
              </span>
              <span className="contact-v5-method-copy">
                <small>Book a call</small>
                <strong>Schedule a conversation</strong>
              </span>
              <ArrowUpRight className="contact-v5-method-arrow" size={17} aria-hidden="true" />
            </a>

            <a className="contact-v5-method" href={siteConfig.emailLink}>
              <span className="contact-v5-method-icon">
                <Mail size={18} aria-hidden="true" />
              </span>
              <span className="contact-v5-method-copy">
                <small>Email</small>
                <strong>{siteConfig.email}</strong>
              </span>
              <ArrowUpRight className="contact-v5-method-arrow" size={17} aria-hidden="true" />
            </a>
          </nav>

          <dl className="contact-v5-location">
            <div>
              <dt>Based in</dt>
              <dd>Kolkata, West Bengal, India</dd>
            </div>
            <div>
              <dt>Available</dt>
              <dd>India · Worldwide</dd>
            </div>
          </dl>
        </div>

        <form
          className="contact-v5-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="contact-v5-form-top">
            <span>Project enquiry</span>
            <span>01 / 01</span>
          </div>

          <p className="contact-v5-form-intro">
            Share the essentials. The completed enquiry opens in WhatsApp for
            you to review before sending.
          </p>

          {invalidFields.size > 0 && (
            <p className="contact-v5-form-alert" role="alert">
              Please complete the highlighted required fields.
            </p>
          )}

          <div className="contact-v5-form-grid">
            <label>
              <span className="contact-v5-label">
                Your name <small>Required</small>
              </span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                placeholder="Your name"
                aria-invalid={invalidFields.has("name")}
                aria-describedby={invalidFields.has("name") ? "name-error" : undefined}
                onInput={(event) =>
                  clearFieldError("name", event.currentTarget.checkValidity())
                }
              />
              {fieldError("name", "Please enter your name.")}
            </label>

            <label>
              <span className="contact-v5-label">Business / Company</span>
              <input
                type="text"
                name="business"
                autoComplete="organization"
                placeholder="Business name"
              />
            </label>

            <label>
              <span className="contact-v5-label">
                Email <small>Required</small>
              </span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                required
                placeholder="you@example.com"
                aria-invalid={invalidFields.has("email")}
                aria-describedby={invalidFields.has("email") ? "email-error" : undefined}
                onInput={(event) =>
                  clearFieldError("email", event.currentTarget.checkValidity())
                }
              />
              {fieldError("email", "Please enter a valid email address.")}
            </label>

            <label>
              <span className="contact-v5-label">WhatsApp / Phone</span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                placeholder="+91..."
              />
            </label>

            <label>
              <span className="contact-v5-label">
                What do you need? <small>Required</small>
              </span>
              <select
                name="websiteType"
                required
                defaultValue=""
                aria-invalid={invalidFields.has("websiteType")}
                aria-describedby={
                  invalidFields.has("websiteType")
                    ? "websiteType-error"
                    : undefined
                }
                onInput={(event) =>
                  clearFieldError(
                    "websiteType",
                    event.currentTarget.checkValidity(),
                  )
                }
              >
                <option value="" disabled>
                  Select project type
                </option>
                <option>Business Website</option>
                <option>Landing Page</option>
                <option>Website Redesign</option>
                <option>Front-End Development</option>
                <option>Booking / WhatsApp Integration</option>
                <option>Lead Form / Automation</option>
                <option>Interactive / 3D Website</option>
                <option>Other</option>
              </select>
              {fieldError("websiteType", "Please select a project type.")}
            </label>

            <label>
              <span className="contact-v5-label">Budget range</span>
              <select name="budget" defaultValue="">
                <option value="">Select budget</option>
                <option>Under ₹10,000</option>
                <option>₹10,000 – ₹25,000</option>
                <option>₹25,000 – ₹50,000</option>
                <option>₹50,000+</option>
                <option>Need guidance</option>
              </select>
            </label>

            <label className="contact-v5-full">
              <span className="contact-v5-label">Desired timeline</span>
              <select name="timeline" defaultValue="">
                <option value="">Select timeline</option>
                <option>As soon as possible</option>
                <option>1–2 weeks</option>
                <option>2–4 weeks</option>
                <option>1–2 months</option>
                <option>Flexible</option>
              </select>
            </label>

            <label className="contact-v5-full">
              <span className="contact-v5-label">
                Tell me about your project <small>Required</small>
              </span>
              <textarea
                name="message"
                required
                rows={6}
                placeholder="What does your business do, what do you need, and what would you like the website to achieve?"
                aria-invalid={invalidFields.has("message")}
                aria-describedby={invalidFields.has("message") ? "message-error" : undefined}
                onInput={(event) =>
                  clearFieldError("message", event.currentTarget.checkValidity())
                }
              />
              {fieldError("message", "Please share a few project details.")}
            </label>
          </div>

          <button className="contact-v5-submit" type="submit">
            <span>Send enquiry through WhatsApp</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </button>

          <p className="contact-v5-form-note" id="contact-form-behaviour">
            This form does not submit to a backend. It opens WhatsApp with your
            project information ready for you to send.
          </p>

          {submitted && (
            <p className="contact-v5-success" role="status">
              Your project enquiry has been prepared in WhatsApp.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
