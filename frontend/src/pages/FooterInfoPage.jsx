import { Link, useLocation } from "react-router-dom";
import "./FooterInfoPage.css";

export const footerPages = {
  "/help": {
    title: "Help Center",
    intro: "Find answers to your questions about travelling, hosting, reservations, and your Airbnb account.",
    sections: [
      ["Getting help", "Sign in to your Airbnb account to find support for your reservations, payments, and account settings."],
      ["Help with travelling", "Learn how to book a stay, manage a reservation, contact a host, and understand cancellation policies."],
      ["Help with hosting", "Find guidance about creating a listing, managing bookings, receiving payments, and communicating with guests."],
      ["Contact Airbnb", "Visit your account's Help Center to find the available support options for your situation."]
    ],
    related: [["Safety", "/safety"], ["AirCover", "/aircover"], ["Cancellation options", "/cancellation"]]
  },

  "/safety": {
    title: "Get help with a safety issue",
    intro: "Your safety matters. Learn about safety information and the support available when using Airbnb.",
    sections: [
      ["Before your trip", "Review listing details, house rules, location information, and communication with your host before travelling."],
      ["During your stay", "Contact your host if you have a concern about your accommodation. If there is an emergency, contact local emergency services."],
      ["Get support", "For an Airbnb-related safety concern, visit the Help Center and choose the issue that best describes your situation."]
    ],
    related: [["Help Center", "/help"], ["AirCover", "/aircover"]]
  },

  "/aircover": {
    title: "AirCover for guests",
    intro: "AirCover provides support and protections for guests when certain problems affect an eligible Airbnb reservation.",
    sections: [
      ["Booking protection", "Learn what support may be available if a host cancels your reservation or a serious issue affects your booking."],
      ["Check-in support", "If you cannot access your accommodation, contact your host and Airbnb support for assistance."],
      ["During your stay", "Report serious problems through the Help Center and provide relevant details about your reservation."]
    ],
    related: [["Help Center", "/help"], ["Safety support", "/safety"]]
  },

  "/travel-insurance": {
    title: "Travel insurance",
    intro: "Learn about travel insurance options and information that may help you prepare for your trip.",
    sections: [
      ["Understanding coverage", "Insurance coverage depends on the policy, provider, and terms that apply to your purchase."],
      ["Before travelling", "Review policy documents carefully to understand what is covered and what exclusions apply."],
      ["Need assistance?", "For questions about an insurance policy, refer to the insurance provider and your policy documents."]
    ],
    related: [["Help Center", "/help"], ["Cancellation options", "/cancellation"]]
  },

  "/anti-discrimination": {
    title: "Anti-discrimination",
    intro: "Airbnb aims to create a community where people from different backgrounds can feel welcome and respected.",
    sections: [
      ["Our commitment", "Airbnb's community policies explain expectations for respectful and inclusive behaviour."],
      ["Report discrimination", "If you experience discrimination during an Airbnb interaction, contact Airbnb through the Help Center."],
      ["Community standards", "Guests and hosts are expected to follow the policies that apply to the Airbnb community."]
    ],
    related: [["Help Center", "/help"], ["Accessibility support", "/accessibility"]]
  },

  "/accessibility": {
    title: "Disability support",
    intro: "Find information about accessibility features and support when searching for or booking an Airbnb stay.",
    sections: [
      ["Accessible listings", "Review listing information and available accessibility features before making a reservation."],
      ["Search and filters", "Use available accessibility filters to help find accommodation that meets your requirements."],
      ["Accessibility assistance", "Visit the Help Center for support with accessibility-related questions."]
    ],
    related: [["Help Center", "/help"], ["Anti-discrimination", "/anti-discrimination"]]
  },

  "/cancellation": {
    title: "Cancellation options",
    intro: "Understand reservation cancellation policies and the options available for your Airbnb booking.",
    sections: [
      ["Check your reservation", "Cancellation terms depend on the listing, reservation, and policy shown when you booked."],
      ["Cancel a reservation", "Sign in to your account, open your Trips, select the reservation, and review the cancellation options."],
      ["Need help?", "If an unexpected situation affects your booking, contact Airbnb through the Help Center."]
    ],
    related: [["Help Center", "/help"], ["Travel insurance", "/travel-insurance"]]
  },

  "/neighborhood-support": {
    title: "Report a neighborhood concern",
    intro: "Airbnb provides a way for neighbours to raise concerns about homes listed on the platform.",
    sections: [
      ["Raise a concern", "Share details about the issue so it can be reviewed by the appropriate support team."],
      ["Safety concerns", "If someone is in immediate danger, contact local emergency services."],
      ["Get support", "Use Airbnb's support resources to find the appropriate way to report your concern."]
    ],
    related: [["Safety support", "/safety"], ["Help Center", "/help"]]
  },

  "/host/home": {
    title: "Airbnb your home",
    intro: "Share your space with travellers and explore what it means to become an Airbnb host.",
    sections: [
      ["Getting started", "Create an account, provide details about your space, add photos, and prepare your listing."],
      ["Manage your listing", "Set availability, pricing, house rules, and information that helps guests understand your space."],
      ["Welcome guests", "Communicate with guests, prepare your accommodation, and manage reservations through your host account."]
    ],
    related: [["Hosting resources", "/host/resources"], ["AirCover for Hosts", "/aircover/hosts"]]
  },

  "/host/hotel": {
    title: "Give your hotel a new home",
    intro: "Explore how hotels can present their properties to travellers through Airbnb.",
    sections: [
      ["Submit your hotel", "Prepare your hotel information, property details, contact information, and room descriptions before starting the submission process."],
      ["Tools for hotels", "Hotels may use supported property-management or channel-management tools to manage availability and reservations."],
      ["Room information", "Provide accurate room descriptions, photographs, amenities, and policies to help guests choose their stay."],
      ["Getting started", "Review the eligibility and onboarding requirements before submitting your property."]
    ],
    related: [["Airbnb your home", "/host/home"], ["Hosting resources", "/host/resources"]]
  },

  "/host/experience": {
    title: "Airbnb your experience",
    intro: "Share an activity, skill, or local knowledge with guests through an Airbnb experience.",
    sections: [
      ["Create an experience", "Describe the activity, explain what guests will do, and provide details about its location and schedule."],
      ["Prepare to host", "Review applicable quality, safety, and hosting requirements before offering an experience."],
      ["Manage bookings", "Keep your availability and experience information up to date."]
    ],
    related: [["Hosting resources", "/host/resources"], ["Community forum", "/community"]]
  },

  "/host/service": {
    title: "Airbnb your service",
    intro: "Explore opportunities to offer professional services to Airbnb guests.",
    sections: [
      ["Describe your service", "Explain what you offer, what is included, and what guests can expect."],
      ["Service information", "Provide accurate details about your qualifications, availability, and service requirements."],
      ["Hosting guidance", "Review the requirements that apply to your service category."]
    ],
    related: [["Hosting resources", "/host/resources"], ["Airbnb your experience", "/host/experience"]]
  },

  "/aircover/hosts": {
    title: "AirCover for Hosts",
    intro: "Learn about the protections and support available to eligible Airbnb hosts.",
    sections: [
      ["Host damage protection", "Review the applicable terms and conditions for eligible damage-related claims."],
      ["Host liability insurance", "Understand the insurance information and coverage terms that apply to eligible situations."],
      ["Request support", "Follow the relevant process through Airbnb's Help Center if you need assistance."]
    ],
    related: [["Hosting resources", "/host/resources"], ["Help Center", "/help"]]
  },

  "/host/earnings": {
    title: "Earnings Protection",
    intro: "Learn about managing hosting income, payouts, and the financial details of your listing.",
    sections: [
      ["Manage your pricing", "Review your nightly price, availability, and any applicable fees."],
      ["Understand payouts", "Check your payout method, transaction details, and payment status in your host account."],
      ["Manage earnings", "Use your hosting account to review the financial information associated with your reservations."]
    ],
    related: [["Airbnb your home", "/host/home"], ["Hosting resources", "/host/resources"]]
  },

  "/host/resources": {
    title: "Hosting resources",
    intro: "Find information to help you prepare your listing and manage your hosting activity.",
    sections: [
      ["Create your listing", "Add clear photographs, accurate descriptions, amenities, and house rules."],
      ["Manage reservations", "Keep your calendar updated and communicate clearly with guests."],
      ["Improve your hosting", "Review guest feedback and keep your listing information accurate."]
    ],
    related: [["Community forum", "/community"], ["Hosting responsibly", "/hosting-responsibly"]]
  },

  "/community": {
    title: "Community forum",
    intro: "Connect with other hosts and learn from shared hosting experiences.",
    sections: [
      ["Connect with hosts", "Explore discussions and learn from people with different hosting experiences."],
      ["Share knowledge", "Exchange ideas about preparing listings, communicating with guests, and managing reservations."],
      ["Community guidelines", "Participate respectfully and follow the rules of the community."]
    ],
    related: [["Hosting resources", "/host/resources"], ["Hosting responsibly", "/hosting-responsibly"]]
  },

  "/hosting-responsibly": {
    title: "Hosting responsibly",
    intro: "Learn about responsible hosting and the rules that may apply to your property.",
    sections: [
      ["Local requirements", "Research local laws, permits, taxes, and regulations before hosting."],
      ["Guest safety", "Provide accurate property information and clear safety instructions."],
      ["Respect your neighbourhood", "Consider noise, shared spaces, waste, and the impact of hosting on neighbours."]
    ],
    related: [["Airbnb your home", "/host/home"], ["Neighborhood support", "/neighborhood-support"]]
  },

  "/apartments": {
    title: "Airbnb-friendly apartments",
    intro: "Learn about apartment buildings that participate in Airbnb-friendly hosting programmes.",
    sections: [
      ["Find participating buildings", "Explore whether participating apartment communities are available in your area."],
      ["Understand the programme", "Review the building's hosting rules, limits, and requirements."],
      ["Before hosting", "Check your lease and building policies before listing your apartment."]
    ],
    related: [["Airbnb your home", "/host/home"], ["Hosting responsibly", "/hosting-responsibly"]]
  },

  "/hosting-classes": {
    title: "Join a free hosting class",
    intro: "Explore learning resources that can help you understand the basics of hosting.",
    sections: [
      ["Learn hosting basics", "Understand how listings, reservations, guest communication, and payouts work."],
      ["Prepare your space", "Learn how to describe your accommodation and prepare it for guests."],
      ["Continue learning", "Explore the hosting resources available through Airbnb."]
    ],
    related: [["Hosting resources", "/host/resources"], ["Community forum", "/community"]]
  },

  "/co-host": {
    title: "Find a co-host",
    intro: "Learn how co-hosting can help with the tasks involved in managing an Airbnb listing.",
    sections: [
      ["Co-host support", "A co-host may help with guest communication, listing management, and other hosting tasks."],
      ["Choose a co-host", "Discuss responsibilities, availability, and arrangements before working together."],
      ["Manage permissions", "Review the account permissions and responsibilities assigned to a co-host."]
    ],
    related: [["Airbnb your home", "/host/home"], ["Hosting resources", "/host/resources"]]
  },

  "/refer-host": {
    title: "Refer a host",
    intro: "Learn about referring someone who may be interested in becoming an Airbnb host.",
    sections: [
      ["How referrals work", "Referral programmes may have eligibility requirements and conditions."],
      ["Invite someone", "Review the referral details available in your account before sharing an invitation."],
      ["Referral information", "Check the applicable programme terms for your location."]
    ],
    related: [["Airbnb your home", "/host/home"], ["Hosting resources", "/host/resources"]]
  },

  "/summer-release": {
    title: "2026 Summer Release",
    intro: "Explore Airbnb's summer product announcements and updates.",
    sections: [
      ["Discover updates", "Learn about new features and product changes announced by Airbnb."],
      ["Explore travel", "Discover ways to explore destinations and plan your next trip."],
      ["Learn more", "Visit Airbnb's official newsroom for company announcements."]
    ],
    related: [["Newsroom", "/newsroom"], ["Help Center", "/help"]]
  },

  "/newsroom": {
    title: "Newsroom",
    intro: "Explore company announcements, news, and stories from Airbnb.",
    sections: [
      ["Company news", "Read announcements and updates about Airbnb."],
      ["Stories", "Explore stories about travel, hosting, and the Airbnb community."],
      ["Media information", "Find official company information and media resources."]
    ],
    related: [["2026 Summer Release", "/summer-release"], ["Careers", "/careers"]]
  },

  "/careers": {
    title: "Careers at Airbnb",
    intro: "Explore opportunities to work with Airbnb and learn about the teams behind the company.",
    sections: [
      ["Life at Airbnb", "Learn about the company's culture, workplace, and approach to collaboration."],
      ["Find a role", "Explore available positions and review the requirements for each opportunity."],
      ["Teams and departments", "Discover the different areas of work across the company."]
    ],
    related: [["Newsroom", "/newsroom"], ["Investors", "/investors"]]
  },

  "/investors": {
    title: "Investor Relations",
    intro: "Find company information and investor-related resources.",
    sections: [
      ["Financial information", "Review official financial reports and published company information."],
      ["Company updates", "Explore announcements and updates relevant to investors."],
      ["Investor resources", "Use Airbnb's official investor resources for current information."]
    ],
    related: [["Newsroom", "/newsroom"], ["Careers", "/careers"]]
  },

  "/gift-cards": {
    title: "Gift cards",
    intro: "Explore Airbnb gift cards and information about giving travel as a gift.",
    sections: [
      ["Give a gift", "Learn about available gift card options and purchasing information."],
      ["Redeem a gift card", "Review the instructions and terms for using an Airbnb gift card."],
      ["Gift card support", "Check the applicable terms and contact support if you need help."]
    ],
    related: [["Help Center", "/help"], ["Explore Airbnb", "/all"]]
  },

  "/emergency-stays": {
    title: "Airbnb.org emergency stays",
    intro: "Learn about Airbnb.org and its work to help people find temporary accommodation during emergencies.",
    sections: [
      ["About Airbnb.org", "Discover the organisation's work supporting people affected by disasters and other emergencies."],
      ["Emergency stays", "Learn how temporary accommodation support may be arranged through partner organisations."],
      ["Ways to help", "Explore information about supporting Airbnb.org's work."]
    ],
    related: [["Newsroom", "/newsroom"], ["Help Center", "/help"]]
  },

  "/privacy": {
    title: "Privacy",
    intro: "Learn about privacy and how personal information is handled when using Airbnb.",
    sections: [
      ["Privacy information", "Review Airbnb's official privacy policy to understand how personal information is collected and used."],
      ["Your information", "Review the account and privacy options available to you."],
      ["Questions", "Visit the Help Center if you need assistance with a privacy-related question."]
    ],
    related: [["Your Privacy Choices", "/privacy-choices"], ["Help Center", "/help"]]
  },

  "/terms": {
    title: "Terms of Service",
    intro: "Review the terms and conditions that apply when using Airbnb.",
    sections: [
      ["Using Airbnb", "Read the terms that explain the responsibilities of people using the platform."],
      ["Guest and host responsibilities", "Review the terms and policies that apply to bookings and hosting."],
      ["More information", "Always refer to the current official Airbnb terms for the applicable legal details."]
    ],
    related: [["Privacy", "/privacy"], ["Help Center", "/help"]]
  },

  "/privacy-choices": {
    title: "Your Privacy Choices",
    intro: "Learn about the privacy choices and account settings available to you.",
    sections: [
      ["Manage your choices", "Review the privacy controls available through your Airbnb account."],
      ["Personal information", "Learn about the options available for managing personal information."],
      ["Privacy support", "Visit the Help Center for assistance with privacy questions."]
    ],
    related: [["Privacy", "/privacy"], ["Help Center", "/help"]]
  }
};

export const footerPagePaths = Object.keys(footerPages);

export default function FooterInfoPage() {
  const { pathname } = useLocation();
  const page = footerPages[pathname];

  if (!page) {
    return (
      <main className="footer-info">
        <h1>Page not found</h1>
        <Link to="/help">Visit Help Center</Link>
      </main>
    );
  }

  return (
    <main className="footer-info">
      <header className="footer-info-header">
        <p className="footer-info-label">AIRBNB</p>
        <h1>{page.title}</h1>
        <p className="footer-info-intro">{page.intro}</p>
      </header>

      <div className="footer-info-content">
        {page.sections.map(([heading, description]) => (
          <section className="footer-info-section" key={heading}>
            <h2>{heading}</h2>
            <p>{description}</p>
          </section>
        ))}

        {page.related?.length > 0 && (
          <section className="footer-info-related">
            <h2>Related information</h2>
            <ul>
              {page.related.map(([label, path]) => (
                <li key={path}>
                  <Link to={path}>{label}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}