import React from 'react';
import { Link } from 'react-router-dom';

// Shared layout for the legal / policy pages linked from the footer.
function LegalLayout({ title, intro, children }) {
  return (
    <section className="interior-designers-section">
      <div className="interior-hero-banner" style={{ background: 'linear-gradient(135deg, #334155, #0f172a)' }}>
        <div className="container">
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
      </div>
      <div className="container interior-content-container" style={{ marginTop: '40px', marginBottom: '60px', maxWidth: '820px' }}>
        <div style={{ lineHeight: '1.75', color: 'var(--text-main)', fontSize: '0.95rem' }}>
          {children}
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '40px' }}>
            Last updated: November 2026. For any questions about this policy, contact us at{' '}
            <a href="mailto:elderobuddysales@gmail.com" style={{ color: 'var(--primary)' }}>elderobuddysales@gmail.com</a>.
          </p>
          <p style={{ marginTop: '16px' }}>
            <Link to="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>&larr; Back to Home</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

function Section({ heading, children }) {
  return (
    <div style={{ marginTop: '26px' }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '1.08rem' }}>{heading}</h3>
      <div style={{ color: 'var(--text-muted)' }}>{children}</div>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      intro="How Elder-O-Buddy collects, uses and protects your information when you buy building materials or enquire about turnkey construction on our marketplace."
    >
      <Section heading="1. Information we collect">
        <p>When you place an order, request a quote, or book a consultation, we collect the details you provide: your name, phone number, email address, delivery/site address, and order or enquiry details. We also store basic usage data (such as cart contents and preferences) in your browser's local storage so the site works smoothly.</p>
      </Section>
      <Section heading="2. How we use your information">
        <p>Your information is used only to process and deliver your orders, respond to enquiries and quotations, arrange turnkey construction consultations, send order-related updates and notifications, and improve our catalogue and services. We do not sell your personal information to third parties.</p>
      </Section>
      <Section heading="3. Sharing with service partners">
        <p>To fulfil your order we may share the minimum necessary details (such as name, phone and delivery address) with delivery/logistics partners, material suppliers, and — for turnkey projects — the builders or designers you choose to engage. These partners may use the details only to complete your delivery or service.</p>
      </Section>
      <Section heading="4. Payments">
        <p>Our marketplace currently operates on a Cash on Delivery basis. We do not collect or store your card, UPI or bank credentials on this website.</p>
      </Section>
      <Section heading="5. Data retention and security">
        <p>We retain order and enquiry records for as long as needed for accounting, warranty and legal purposes under Indian law. Administrative access to customer records is restricted, and we take reasonable technical measures to protect the data we hold.</p>
      </Section>
      <Section heading="6. Your rights">
        <p>You may ask us to access, correct or delete your personal information, or withdraw consent for marketing communication, by writing to us at the contact email below. We will respond within a reasonable time.</p>
      </Section>
      <Section heading="7. Changes to this policy">
        <p>We may update this policy from time to time. The current version will always be available on this page.</p>
      </Section>
    </LegalLayout>
  );
}

export function TermsConditions() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      intro="The terms that govern your use of the Elder-O-Buddy marketplace for building materials and turnkey home construction services."
    >
      <Section heading="1. About the marketplace">
        <p>Elder-O-Buddy is an online marketplace for building materials (including cement, steel, bricks, tiles, plumbing, electricals, paints and hardware) and an enquiry platform for turnkey home construction services, operating in India.</p>
      </Section>
      <Section heading="2. Pricing and availability">
        <p>Prices shown are indicative and may vary by city, quantity and delivery location. The final price, including delivery charges and applicable GST, is confirmed at checkout or in your quotation. We may correct pricing errors and cancel orders affected by them, with a full refund of any amount already paid.</p>
      </Section>
      <Section heading="3. Orders and payment">
        <p>Orders are payable by Cash on Delivery (payment at the time of delivery at your site) unless a different arrangement is agreed in writing. An order is confirmed only after our team verifies stock and delivery feasibility for your location.</p>
      </Section>
      <Section heading="4. Delivery">
        <p>Delivery timelines are estimates and depend on material type, quantity and site accessibility. Bulk and heavy materials (such as steel, cement and aggregates) are delivered to the nearest vehicle-accessible point at the address provided.</p>
      </Section>
      <Section heading="5. Turnkey construction services">
        <p>Turnkey construction, builder and designer engagements initiated through this platform are governed by a separate written agreement (including scope, BOQ and payment schedule) between you and the service provider. Estimates shown on the website are indicative only.</p>
      </Section>
      <Section heading="6. Acceptable use">
        <p>You agree to provide accurate information, and not to misuse the platform, interfere with its operation, or use it for any unlawful purpose.</p>
      </Section>
      <Section heading="7. Liability">
        <p>To the extent permitted by law, our liability for any order is limited to the value of that order. Nothing in these terms excludes liability that cannot be excluded under Indian law.</p>
      </Section>
      <Section heading="8. Governing law">
        <p>These terms are governed by the laws of India. Disputes will be subject to the jurisdiction of the competent courts in Haryana, India.</p>
      </Section>
    </LegalLayout>
  );
}

export function RefundPolicy() {
  return (
    <LegalLayout
      title="Refund & Cancellation Policy"
      intro="How cancellations, replacements and refunds work for material orders placed on Elder-O-Buddy."
    >
      <Section heading="1. Cash on Delivery orders">
        <p>Most orders on our marketplace are Cash on Delivery: you pay only when the material reaches your site. If material arrives damaged, defective, or different from what you ordered, you may refuse it at the time of delivery — no payment is due for refused items.</p>
      </Section>
      <Section heading="2. Cancellation">
        <p>You may cancel an order free of charge any time before it is dispatched. Once dispatched, cancellation may attract the actual delivery/transport cost incurred.</p>
      </Section>
      <Section heading="3. Returns and replacements">
        <p>Unused material in its original, sealed condition (for example unopened cement bags, undamaged tiles in sealed boxes) may be returned within 7 days of delivery for replacement or refund, subject to inspection at pickup. For quality issues reported after delivery, contact us within 48 hours with photos so we can arrange inspection and replacement.</p>
      </Section>
      <Section heading="4. Non-returnable items">
        <p>For safety and quality reasons, the following cannot be returned once delivered/accepted: ready-mix concrete and other perishable mixes, steel or other material cut to your custom sizes, and opened/consumed material.</p>
      </Section>
      <Section heading="5. Refund process and timelines">
        <p>Where any amount was paid in advance (for example for a turnkey booking), approved refunds are processed within 7–10 working days to the original payment method or bank/UPI account you provide. Cash-on-Delivery orders that were refused at delivery require no refund, as no payment was collected.</p>
      </Section>
      <Section heading="6. Turnkey services">
        <p>Cancellations and refunds for turnkey construction engagements follow the cancellation schedule in your signed project agreement, which prevails over this policy.</p>
      </Section>
      <Section heading="7. How to raise a request">
        <p>To cancel, return or claim a refund, contact us at the email below with your order details. Our team will confirm pickup or inspection arrangements.</p>
      </Section>
    </LegalLayout>
  );
}
