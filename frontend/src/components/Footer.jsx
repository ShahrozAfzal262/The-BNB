
import { Facebook, Globe, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "Support",
    links: [
      ["Help Center", "/help"],
      ["Get help with a safety issue", "/safety"],
      ["AirCover", "/aircover"],
      ["Travel insurance", "/travel-insurance"],
      ["Anti-discrimination", "/anti-discrimination"],
      ["Disability support", "/accessibility"],
      ["Cancellation options", "/cancellation"],
      ["Report neighborhood concern", "/neighborhood-support"],
    ],
  },
  {
    title: "Hosting",
    links: [
      ["The bnb your home", "/host/home"],
      ["The bnb your hotel", "/host/hotel"],
      ["The bnb your experience", "/host/experience"],
      ["The bnb your service", "/host/service"],
      ["AirCover for Hosts", "/aircover/hosts"],
      ["Earnings Protection", "/host/earnings"],
      ["Hosting resources", "/host/resources"],
      ["Community forum", "/community"],
      ["Hosting responsibly", "/hosting-responsibly"],
      ["The bnb-friendly apartments", "/apartments"],
      ["Join a free hosting class", "/hosting-classes"],
      ["Find a co-host", "/co-host"],
      ["Refer a host", "/refer-host"],
    ],
  },
  {
    title: "The bnb",
    links: [
      ["2026 Summer Release", "/summer-release"],
      ["Newsroom", "/newsroom"],
      ["Careers", "/careers"],
      ["Investors", "/investors"],
      ["Gift cards", "/gift-cards"],
      ["Airbnb.org emergency stays", "/emergency-stays"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-link-columns">
        {footerSections.map((section) => (
          <section className="footer-link-column" key={section.title}>
            <h2>{section.title}</h2>

            {section.links.map(([label, path]) => (
              <Link to={path} key={label}>
                {label}
              </Link>
            ))}
          </section>
        ))}
      </div>

      <div className="footer-bottom">
        <div className="footer-legal">
          <span>© {new Date().getFullYear()} The bnb</span>
          <span aria-hidden="true">·</span>
          <Link to="/privacy">Privacy</Link>
          <span aria-hidden="true">·</span>
          <Link to="/terms">Terms</Link>
          <span aria-hidden="true">·</span>
          <Link to="/privacy-choices">Your Privacy Choices</Link>
        </div>

        <div className="footer-locale">
          <span><Globe size={17} /> English (US)</span>
          <span>$ &nbsp;AUD</span>

          <a
            href="https://www.facebook.com/"
            aria-label="Facebook"
            target="_blank"
            rel="noreferrer"
          >
            <Facebook size={18} fill="currentColor" />
          </a>

          <a
            href="https://www.instagram.com/"
            aria-label="Instagram"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
