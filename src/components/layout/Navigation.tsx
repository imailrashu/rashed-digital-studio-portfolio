import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";

import { siteConfig } from "../../data/siteConfig";
import ThemeToggle from "../theme/ThemeToggle";

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousActive = document.activeElement as HTMLElement | null;
    const menu = mobileMenuRef.current;
    const menuButton = menuButtonRef.current;

    document.body.style.overflow = "hidden";
    menu
      ?.querySelector<HTMLElement>(focusableSelector)
      ?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !menu) return;

      const focusable = Array.from(
        menu.querySelectorAll<HTMLElement>(focusableSelector),
      );
      const first = focusable.at(0);
      const last = focusable.at(-1);

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);

      if (previousActive === menuButton) {
        menuButton?.focus();
      } else {
        previousActive?.focus();
      }
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`site-header ${scrolled ? "site-header-scrolled" : ""} ${menuOpen ? "site-header-menu-open" : ""}`}
    >
      <div className="nav-shell">
        <a
          className="brand"
          href="#home"
          onClick={closeMenu}
        >
          <span className="brand-text">
            <strong>Rashed</strong>
            <small>Digital Studio</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {siteConfig.navLinks.map((item, index) => (
            <a href={item.href} key={item.label}>
              <span aria-hidden="true">0{index + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="desktop-actions">
          <ThemeToggle />
          <a
            className="nav-project-button"
            href={siteConfig.calendly}
            target="_blank"
            rel="noopener noreferrer"
          >
            Start a Project
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>

        <div className="mobile-actions">
          <ThemeToggle compact />
          <button
            className="mobile-menu-button"
            ref={menuButtonRef}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span>{menuOpen ? "Close" : "Menu"}</span>
            {menuOpen ? (
              <X size={19} aria-hidden="true" />
            ) : (
              <Menu size={19} aria-hidden="true" />
            )}
          </button>
        </div>

        {menuOpen && (
          <div
            className="mobile-menu"
            id="mobile-menu"
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="mobile-menu-inner">
              <span className="mobile-menu-kicker">Navigation / 2026</span>

              <nav className="mobile-nav" aria-label="Mobile navigation">
                {siteConfig.navLinks.map((item, index) => (
                  <a
                    href={item.href}
                    key={item.label}
                    onClick={closeMenu}
                  >
                    <span aria-hidden="true">0{index + 1}</span>
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="mobile-menu-footer">
                <div>
                  <span>Kolkata, India</span>
                  <span>Available worldwide</span>
                </div>

                {siteConfig.socialLinks.linkedin && (
                  <a
                    href={siteConfig.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
              </div>

              <a
                className="mobile-project-button"
                href={siteConfig.calendly}
                target="_blank"
                rel="noopener noreferrer"
              >
                Start a Project
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
